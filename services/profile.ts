import mongoose from "mongoose"
import { validateAge, validateBio, validateEmail, validateGender, validateName } from "../validation/inputs"
import { validateBoolean, validatePositiveNumber, validateString, validateStringArray } from "../validation/types"
import User from "../model/userSchema";
import Worker from "../model/workerCategorySchema";
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
    category: string;
    query: string;
}
export const getWorkersListService = ({page, pageSize, sort, rating4Plus, previouslyHired, userId, category, query}: GetWorkersListServiceProps) => {
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
                        _id: {
                            $ne: new mongoose.Types.ObjectId(userId)
                        },
                        ...(category ? {
                            categoryList: {
                                $elemMatch: {
                                    id: new mongoose.Types.ObjectId(category)
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
                        gender: 1,
                        openToWork: 1,
                        bio: 1,
                        firstName: 1,
                        lastName: 1,
                        categoryList: 1,
                        isVerified: 1,
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
                        primaryCategoryId: {
                            $arrayElemAt: [
                                "$primaryCategoryData._id",
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
                Worker.find().lean().then((workers) => {
                    query = query.toLowerCase()
                    for(let i in response){
                        if(!!query && !response[i].firstName?.toLowerCase()?.includes(query) && !response[i].lastName?.toLowerCase()?.includes(query) && !`${response[i].firstName} ${response[i].lastName}`.toLowerCase().includes(query)){
                            response.splice(parseInt(i), 1);
                            continue;
                        }
                        for(let j in response[i].categoryList){
                            for(let worker of workers){
                                if(JSON.stringify(response[i].categoryList[j].id) === JSON.stringify(worker._id)){
                                    response[i].categoryList[j] = { ...response[i].categoryList[j], ...worker}
                                    delete response[i].categoryList[j]._id;
                                    delete response[i].categoryList[j].dailyMinWage;
                                    delete response[i].categoryList[j].hourlyMinWage;
                                }
                            }
                        }
                    }
                    resolve({data: response})
                })
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
                        gender: 1,
                        openToWork: 1,
                        bio: 1,
                        firstName: 1,
                        lastName: 1,
                        categoryList: 1,
                        isVerified: 1,
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
                        primaryCategoryId: {
                            $arrayElemAt: [
                                "$primaryCategoryData._id",
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
                Worker.find().lean().then((workers) => {
                    for(let i in response){
                        for(let j in response[i].categoryList){
                            for(let worker of workers){
                                if(JSON.stringify(response[i].categoryList[j].id) === JSON.stringify(worker._id)){
                                    response[i].categoryList[j] = { ...response[i].categoryList[j], ...worker}
                                    delete response[i].categoryList[j]._id;
                                    delete response[i].categoryList[j].dailyMinWage;
                                    delete response[i].categoryList[j].hourlyMinWage;
                                }
                            }
                        }
                    }
                    resolve({data: response[0]})
                })
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}


export const getRatingsListService = ({id, userId }: {id: string, userId: string}) => {
    return new Promise((resolve, reject) => {
        try {
            if(id === undefined){
                return reject({status: 400, error: "id field is required!"})
            }
            User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },{
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "ratedUserId",
                        as: "ratingsDetails"
                    }
                },{
                    $unwind: "$ratingsDetails"
                },{
                    $group: {
                        _id: "$_id",
                        one: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$ratingsDetails.rating",
                                            1
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        two: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$ratingsDetails.rating",
                                            2
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        three: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$ratingsDetails.rating",
                                            3
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        four: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$ratingsDetails.rating",
                                            4
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        five: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$ratingsDetails.rating",
                                            5
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        ratingsCount: {
                            $sum: 1
                        },
                        ratingAverage: {
                            $avg: "$ratingsDetails.rating"
                        }
                    }
                }
            ]).then((response: any) => {
                const blankData = {
                    One: 0,
                    Two: 0,
                    Three: 0,
                    Four: 0,
                    Five: 0,
                    ratingsAverage: 0,
                    ratingsCount: 0
                }
                resolve({data: response.length === 0 ? blankData : response[0]})
            }).catch((error) => {
                console.log(error)
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}