import mongoose from "mongoose";
import Rating from "../model/ratingSchema";

interface AddRatingService {
    userId: string | mongoose.Types.ObjectId;
    ratedUserId: string | mongoose.Types.ObjectId;
    rating: number;
    review: string;
    isWorker: boolean;
}
export const AddRatingService = ({ userId, ratedUserId, rating, review, isWorker }: AddRatingService) => {
    return new Promise((resolve, reject) => {
        try {
            Rating.create({
                userId: new mongoose.Types.ObjectId(userId),
                ratedUserId: new mongoose.Types.ObjectId(ratedUserId),
                rating: rating,
                review: review,
                isWorker: isWorker ? isWorker : false,
                timestamp: new Date()
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

interface GetRatingsService {
    ratedUserId: string;
    page: any;
    pageSize: any;
}
export const getRatingsService = ({ ratedUserId, page, pageSize }: GetRatingsService) => {
    return new Promise((resolve, reject) => {
        try {
            Rating.aggregate([
                {
                    $match: {
                        ratedUserId: new mongoose.Types.ObjectId(ratedUserId)
                    }
                },{
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },{
                    $project: {
                        userId: 1,
                        ratedUserId: 1,
                        rating: 1,
                        review: 1,
                        isWorker: 1,
                        timestamp: 1,
                        firstName: {
                            $arrayElemAt: [
                                "$userDetails.firstName",
                                0
                            ]
                        },
                        lastName: {
                            $arrayElemAt: [
                                "$userDetails.lastName",
                                0
                            ]
                        }
                    }
                },{
                    $skip: (page !== undefined && pageSize !== undefined) ? (page * pageSize) : 0
                },{
                    $limit: pageSize ? parseInt(pageSize) : 1
                }
            ]).then((response: any) => {
                response = response.map((res: any) => ({...res, timestamp: res.timestamp?.getTime()}))
                resolve({data: response})
            }).catch((error) => {
                console.log(error)
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}