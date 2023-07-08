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
                isWorker: isWorker,
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
    page: number;
    pageSize: number;
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
                }
            ]).skip(page * pageSize).limit(pageSize).then((response: any) => {
                response.forEach((data: any, i: number, arr: any) => {
                    arr[i].firstName = arr[i].userDetails[0].firstName;
                    arr[i].lastName = arr[i].userDetails[0].lastName;
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