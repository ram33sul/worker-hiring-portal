import mongoose from "mongoose";
import Favourites from "../model/favouritesSchema";
import User from "../model/userSchema";
import Worker from "../model/workerCategorySchema";

export const addToFavouritesService = ({addedUserId, userId}: {addedUserId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            if(!addedUserId){
                return reject({status: 400, error: "addedUserId is required!"})
            }
            userId = new mongoose.Types.ObjectId(userId);
            addedUserId = new mongoose.Types.ObjectId(addedUserId);
            Favourites.create({
                userId: userId,
                addedUserId: addedUserId
            }).then(() => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const removeFavouritesService = ({removedUserId}: {removedUserId: string | mongoose.Types.ObjectId }) => {
    return new Promise((resolve, reject) => {
        try {
            Favourites.deleteOne({
                addedUserId: new mongoose.Types.ObjectId(removedUserId)
            }).then((response) => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 500, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Interal error occured!"})
        }
    })
}

export const getFavouritesService = ({userId, page, pageSize}: {userId: string | mongoose.Types.ObjectId, page: number, pageSize: any}) => {
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
            Favourites.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                },{
                    $lookup: {
                        from: "users",
                        localField: "addedUserId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },{
                    $project: {
                        userId: "addedUserId",
                        userDetails: {
                            $first: "$userDetails"
                        }
                    }
                },{
                    $project: {
                        _id: "$userDetails._id",
                        userId: "$userDetails._id",
                        gender: "$userDetails.gender",
                        openToWork: "$userDetails.openToWork",
                        bio: "$userDetails.bio",
                        firstName: "$userDetails.firstName",
                        lastName: "$userDetails.lastName",
                        categoryList: "$userDetails.categoryList",
                        isVerified: "$userDetails.isVerified",
                        profileImageUrl: "$userDetails.profilePicture",
                        primaryCategory: "$userDetails.primaryCategory",
                        selectedAddress: "$userDetails.selectedAddress",
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
                        profileImageUrl: 1,
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
                    resolve({data: response})
                })
                resolve({data: response})
            }).catch((error) => {
                reject({status: 500, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Interal error occured!"})
        }
    })
}