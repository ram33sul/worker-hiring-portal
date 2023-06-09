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
                        from: "user",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },{
                    $skip: (page !== undefined && pageSize !== undefined) ? (page * pageSize) : 0
                },{
                    $limit: pageSize ? parseInt(pageSize) : 1
                }
            ]).then((response: any) => {
                response.forEach((data: any, i: number, arr: any) => {
                    arr[i].firstName = arr[i].userDetails?.[0]?.firstName;
                    arr[i].lastName = arr[i].userDetails?.[0]?.lastName;
                    arr[i].profileImageUrl = arr[i].userDetails?.[0]?.profilePicture;
                    delete arr[i].userDetails;
                })
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}