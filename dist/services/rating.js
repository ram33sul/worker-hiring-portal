"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRatingsService = exports.AddRatingService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ratingSchema_1 = __importDefault(require("../model/ratingSchema"));
const AddRatingService = ({ userId, ratedUserId, rating, review, isWorker }) => {
    return new Promise((resolve, reject) => {
        try {
            ratingSchema_1.default.create({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                ratedUserId: new mongoose_1.default.Types.ObjectId(ratedUserId),
                rating: rating,
                review: review,
                isWorker: isWorker,
                timestamp: new Date()
            }).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occured!" });
        }
    });
};
exports.AddRatingService = AddRatingService;
const getRatingsService = ({ ratedUserId, page, pageSize }) => {
    return new Promise((resolve, reject) => {
        try {
            ratingSchema_1.default.aggregate([
                {
                    $match: {
                        ratedUserId: new mongoose_1.default.Types.ObjectId(ratedUserId)
                    }
                }, {
                    $lookup: {
                        from: "user",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                }, {
                    $project: {
                        lastName: "$userDetails[0]."
                    }
                }
            ]).skip(page * pageSize).limit(pageSize).then((response) => {
                response.firstName = response[0].userDetails[0].firstName;
                response.lastName = response[0].userDetails[0].lastName;
                delete response[0].userDetails;
                resolve({ data: response[0] });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occured!" });
        }
    });
};
exports.getRatingsService = getRatingsService;
