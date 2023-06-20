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
                isWorker: isWorker
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
            Rating.find({
                ratedUserId: new mongoose.Types.ObjectId(ratedUserId)
            }).skip(page * pageSize).limit(pageSize).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}