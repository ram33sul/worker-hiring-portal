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
                        from: "user",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                }, {
                    $skip: (page !== undefined && pageSize !== undefined) ? (page * pageSize) : 0
                }, {
                    $limit: pageSize ? parseInt(pageSize) : 1
                }
            ]).then((response) => {
                response.forEach((data, i, arr) => {
                    var _a, _b, _c, _d, _e, _f;
                    arr[i].firstName = (_b = (_a = arr[i].userDetails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.firstName;
                    arr[i].lastName = (_d = (_c = arr[i].userDetails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.lastName;
                    arr[i].profileImageUrl = (_f = (_e = arr[i].userDetails) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.profilePicture;
                    delete arr[i].userDetails;
                });
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
exports.getRatingsService = getRatingsService;
