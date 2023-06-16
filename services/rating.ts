import mongoose from "mongoose";
import Rating from "../model/ratingSchema";

interface AddRatingService {
    userId: string | mongoose.Types.ObjectId;
    id: string | mongoose.Types.ObjectId;
    rating: number;
    review: string;
    isWorker: boolean;
}
export const AddRatingService = ({ userId, id, rating, review, isWorker }: AddRatingService) => {
    return new Promise((resolve, reject) => {
        try {
            Rating.create({
                userId: new mongoose.Types.ObjectId(userId),
                ratedUserId: new mongoose.Types.ObjectId(id),
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
    id: string;
    page: number;
    pageSize: number;
}
export const getRatingsService = ({ id, page, pageSize }: GetRatingsService) => {
    return new Promise((resolve, reject) => {
        try {
            Rating.find({
                ratedUserId: new mongoose.Types.ObjectId(id)
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