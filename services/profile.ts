import mongoose from "mongoose"
import { validateAge, validateBio, validateEmail, validateGender, validateName } from "../validation/inputs"
import { validateBoolean, validatePositiveNumber, validateString, validateStringArray } from "../validation/types"
import User from "../model/userSchema";
import { validate } from "../validation/general";
import { uploadToCloudinary } from "./cloudinary";

interface EditProfileServiceData {
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    userId: string | mongoose.Types.ObjectId,
    age: number
}

interface EditProfileService {
    data: string;
    file: unknown;
    userId: string | mongoose.Types.ObjectId;
}

export const editProfileService = ({
    userId,
    data,
    file
}: EditProfileService) => {
    return new Promise(async (resolve, reject) => {
        let { firstName, lastName, gender, email, age }: EditProfileServiceData = JSON.parse(data);
        const profilePicture = file;
        try {
            const errors = validate([
                [ 'firstName', validateString, firstName ],
                [ 'lastname', validateString, lastName ],
                [ 'gender', validateGender, gender ],
                [ 'email', validateEmail, email],
                [ 'age', validateAge, age]
            ]);
            if(errors.length){
                return reject({errors, status: 400, error: "invalid inputs!"});
            }
            let profilePicUrl = ''
            if(profilePicture){
                await uploadToCloudinary(`profilePicture/${userId}.png`).then((result: any) => {
                    profilePicUrl = result.url;
                }).catch((error) => {
                    reject([{error: "Can't be uploaded to cloudinary!", status: 500}]);
                    return;
                });
            }
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{ 
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    email: email,
                    age: age,
                    ...(profilePicUrl && {
                        profilePicture: profilePicUrl
                    })
                }
            }).then(() => {
                return User.findOne({_id: userId})
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

interface RegisterAsWorkerServiceData {
    bio: string, 
    age: number,
    categoryList: {
        id: string | mongoose.Types.ObjectId,
        hourlyWage: number,
        dailyWage: number
    }[],
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    openToWork: boolean,
    primaryCategory: string
}

interface RegisterAsWorkerService {
    data: string,
    files: {
        profilePicture: File[],
        identity: File[]
    },
    userId: string | mongoose.Types.ObjectId
}

export const registerAsWorkerService = ({ data, files, userId }: RegisterAsWorkerService) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { bio, age, categoryList, firstName, lastName, email, gender, openToWork, primaryCategory }: RegisterAsWorkerServiceData = JSON.parse(data);
            const profilePicture = files.profilePicture?.[0];
            const identity = files.identity?.[0];
            if(!(validateBio(bio) && validateAge(age) && validateName(firstName) && validateName(lastName) && validateEmail(email) && (gender === undefined || validateGender(gender)) && (openToWork === undefined || validateBoolean(openToWork)))){
                return reject({status: 400, error: "invalid inputs!"});
            }
            if(!Array.isArray(categoryList)){
                return reject({status: 400, error: "category list must be an array!"});
            }
            const isPrimaryCategory = categoryList.filter((elem) => elem.id === primaryCategory);
            if(primaryCategory && isPrimaryCategory.length !== 1){
                return reject({status: 400, error: "Primary skill must be only one and should be included in the category list!"})
            }
            let profilePicUrl = ''
            if(profilePicture){
                await uploadToCloudinary(`profilePicture/${userId}.png`).then((result: any) => {
                    profilePicUrl = result.url;
                }).catch((error) => {
                    reject([{error: "Can't be uploaded to cloudinary!", status: 500}]);
                    return;
                });
            }
            let identityUrl = '';
            if(identity){
                await uploadToCloudinary(`identity/${userId}.png`).then((result: any) => {
                    identityUrl = result.url;
                }).catch((error) => {
                    reject([{error: "Can't be uploaded to cloudinary!", status: 500}]);
                    return;
                });
            }
            categoryList = categoryList.map((elem) => ({...elem, id: new mongoose.Types.ObjectId(elem.id)}))
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{
                $set: {
                    bio,
                    age,
                    categoryList,
                    firstName,
                    lastName,
                    email,
                    gender,
                    openToWork,
                    isWorker: true,
                    primaryCategory: new mongoose.Types.ObjectId(primaryCategory),
                    ...(profilePicUrl && {
                        profilePicture: profilePicUrl
                    }),
                    ...(identityUrl && {
                        identityUrl: identityUrl
                    })
                }
            }).then(() => {
                return User.findOne({_id: userId})
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            console.log(error)
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const openToWorkOnService = ({userId}: {userId: mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{
                $set: {
                    openToWork: true
                }
            }).then(() => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

export const openToWorkOffService = ({userId}: {userId: mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{
                $set: {
                    openToWork: false
                }
            }).then(() => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

export const getUserDetailsService = ({id, userId }: {id: string, userId: string}) => {
    return new Promise((resolve, reject) => {
        try {
            const _id = new mongoose.Types.ObjectId(id);
            User.aggregate([
                {
                    $match: {
                        _id: _id
                    }
                },{
                    $lookup: {
                        from: "workers",
                        localField: "categoryList.id",
                        foreignField: "_id",
                        as: "categoryListDetails"
                    }
                }
            ]).then((response) => {
                for(let i = 0; i < response[0].categoryList.length; i++){
                    for(let j = 0; j < response[0].categoryListDetails.length; j++){
                        if(JSON.stringify(response[0].categoryList[i].id) === JSON.stringify(response[0].categoryListDetails[j]._id)){
                            response[0].categoryList[i] = { ...response[0].categoryList[i], ...response[0].categoryListDetails[j]};
                        }
                    }
                }
                if(id !== userId){
                    delete response[0].identityUrl;
                }
                resolve({data: response[0]})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}


interface GetWorkersListServiceProps {
    userId: string;
    page: any;
    pageSize: any;
    sort: number;
    rating4Plus: string;
    previouslyHired: string;
    category: string
}
export const getWorkersListService = ({page, pageSize, sort, rating4Plus, previouslyHired, userId, category}: GetWorkersListServiceProps) => {
    const sorts = ["rating", "distance", "wageLowToHigh", "wageHighToLow"];
    return new Promise(async (resolve, reject) => {
        try {
            const { location } = (await User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
                    }
                },{
                    $lookup: {
                        from: "addresses",
                        localField: "selectedAddress",
                        foreignField: "_id",
                        as: "address"
                    }
                },{
                    $project: {
                        _id: 0,
                        location: {
                            $arrayElemAt: [
                                "$address.location",
                                0
                            ]
                        }
                    }
                }
            ]))[0];
            User.aggregate([
                {
                    $match: {
                        isWorker: true,
                        openToWork: true,
                        _id: {
                            $ne: new mongoose.Types.ObjectId(userId)
                        },
                        ...(category ? {
                            categoryList: {
                                $elemMatch: {
                                    id: new mongoose.Types.ObjectId
                                }
                            }
                        } : {} )
                    }
                },{
                    $lookup: {
                        from: "workers",
                        localField: "primaryCategory",
                        foreignField: "_id",
                        as: "primaryCategoryData"
                    }
                },{
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "ratedUserId",
                        as: "ratings"
                    }
                },{
                    $lookup: {
                        from: "addresses",
                        localField: "selectedAddress",
                        foreignField: "_id",
                        as: "address"
                    }
                },{
                    $lookup: {
                        from: "favourites",
                        localField: "_id",
                        foreignField: "addedUserId",
                        as: "isFavourite"
                    }
                },{
                    $project: {
                        userId: "$_id",
                        firstName: 1,
                        lastName: 1,
                        profileImageUrl: "$profilePicture",
                        ratingAverage: {
                            $avg: "$ratings.rating"
                        },
                        ratingCount: {
                            $size: "$ratings"
                        },
                        address: {
                            $first: "$address"
                        },
                        isFavourite: {
                            $reduce: {
                                input: "$isFavourite",
                                initialValue: false,
                                in: {
                                    $cond: [
                                        {
                                            $or: [
                                                {
                                                    $eq: [
                                                        {
                                                            $toString: "$$this.userId"
                                                        },
                                                        userId
                                                    ]
                                                },
                                                "$$value"
                                            ]
                                        },
                                        true,
                                        false
                                    ]
                                }
                            }
                        },
                        primaryCategoryName: {
                            $arrayElemAt: [
                                "$primaryCategoryData.title",
                                0
                            ]
                        },
                        primaryCategoryDailyWage: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: "$categoryList",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$this.id",
                                                        "$primaryCategory"
                                                    ]
                                                },
                                                "$$this.dailyWage",
                                                null
                                            ]
                                        }
                                    }
                                },
                                0
                            ]
                        }
                    }
                },{
                    $addFields: {
                        address: {
                            $ifNull: ["$address", null]
                        }
                    }
                },{
                    $match: {
                        ratingAverage: {
                            $gte: rating4Plus === 'true' ? 5 : 0
                        },
                        ...(previouslyHired === 'true' ? {
                            previouslyHired: true
                        }: {})
                    }
                },{
                    $sort: (
                        sorts[sort] === 'rating' ?
                        {
                            ratingAverage: -1
                        } : sorts[sort] === 'wageLowToHigh' ?
                        {
                            primaryCategoryDailyWage: 1
                        } : sorts[sort] === 'wageHighToLow' ?
                        {
                            primaryCategoryDailyWage: -1
                        } : {ratingAverage: -1}
                    )
                },{
                    $addFields: {
                        distance: {
                          $sqrt: {
                            $add: [
                              {
                                $pow: [
                                  {
                                    $subtract: [
                                      location[0], {
                                        '$arrayElemAt': [
                                          '$address.location', 0
                                        ]
                                      }
                                    ]
                                  }, 2
                                ]
                              }, {
                                $pow: [
                                  {
                                    $subtract: [
                                      location[1], {
                                        $arrayElemAt: [
                                          '$address.location', 1
                                        ]
                                      }
                                    ]
                                  }, 2
                                ]
                              }
                            ]
                          }
                        }
                      }
                },{
                    $skip: (page !== undefined && pageSize !== undefined) ? (page * pageSize) : 0
                },{
                    $limit: pageSize ? parseInt(pageSize) : 1
                }
            ]).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}


export const getWorkerDetailsService = ({userId, id}: {userId: string, id: string}) => {
    return new Promise(async (resolve, reject) => {
        try {
            User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },{
                    $lookup: {
                        from: "workers",
                        localField: "primaryCategory",
                        foreignField: "_id",
                        as: "primaryCategoryData"
                    }
                },{
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "ratedUserId",
                        as: "ratings"
                    }
                },{
                    $lookup: {
                        from: "addresses",
                        localField: "selectedAddress",
                        foreignField: "_id",
                        as: "address"
                    }
                },{
                    $lookup: {
                        from: "favourites",
                        localField: "_id",
                        foreignField: "addedUserId",
                        as: "isFavourite"
                    }
                },{
                    $project: {
                        userId: "$_id",
                        firstName: 1,
                        lastName: 1,
                        profileImageUrl: "$profilePicture",
                        ratingAverage: {
                            $avg: "$ratings.rating"
                        },
                        ratingCount: {
                            $size: "$ratings"
                        },
                        address: {
                            $first: "$address"
                        },
                        isFavourite: {
                            $reduce: {
                                input: "$isFavourite",
                                initialValue: false,
                                in: {
                                    $cond: [
                                        {
                                            $or: [
                                                {
                                                    $eq: [
                                                        {
                                                            $toString: "$$this.userId"
                                                        },
                                                        userId
                                                    ]
                                                },
                                                "$$value"
                                            ]
                                        },
                                        true,
                                        false
                                    ]
                                }
                            }
                        },
                        primaryCategoryName: {
                            $arrayElemAt: [
                                "$primaryCategoryData.title",
                                0
                            ]
                        },
                        primaryCategoryDailyWage: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: "$categoryList",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$this.id",
                                                        "$primaryCategory"
                                                    ]
                                                },
                                                "$$this.dailyWage",
                                                null
                                            ]
                                        }
                                    }
                                },
                                0
                            ]
                        }
                    }
                },{
                    $addFields: {
                        address: {
                            $ifNull: ["$address", null]
                        }
                    }
                }
            ]).then((response) => {
                resolve({data: response[0]})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}