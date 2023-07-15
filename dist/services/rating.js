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
                isWorker: isWorker ? isWorker : false,
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
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                }, {
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
                        },
                        profileImageUrl: {
                            $arrayElemAt: [
                                "$userDetails.profilePicture",
                                0
                            ]
                        }
                    }
                }, {
                    $skip: (page !== undefined && pageSize !== undefined) ? (page * pageSize) : 0
                }, {
                    $limit: pageSize ? parseInt(pageSize) : 1
                }
            ]).then((response) => {
                response = response.map((res) => { var _a; return (Object.assign(Object.assign({}, res), { timestamp: (_a = res.timestamp) === null || _a === void 0 ? void 0 : _a.getTime() })); });
                resolve({ data: response });
            }).catch((error) => {
                console.log(error);
                reject({ status: 502, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occured!" });
        }
    });
};
exports.getRatingsService = getRatingsService;
