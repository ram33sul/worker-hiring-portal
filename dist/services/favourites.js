"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavouritesService = exports.removeFavouritesService = exports.addToFavouritesService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const favouritesSchema_1 = __importDefault(require("../model/favouritesSchema"));
const userSchema_1 = __importDefault(require("../model/userSchema"));
const addToFavouritesService = ({ addedUserId, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            if (!addedUserId) {
                return reject({ status: 400, error: "addedUserId is required!" });
            }
            userId = new mongoose_1.default.Types.ObjectId(userId);
            addedUserId = new mongoose_1.default.Types.ObjectId(addedUserId);
            favouritesSchema_1.default.create({
                userId: userId,
                addedUserId: addedUserId
            }).then(() => {
                resolve({ data: 'done' });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occured!" });
        }
    });
};
exports.addToFavouritesService = addToFavouritesService;
const removeFavouritesService = ({ removedUserId }) => {
    return new Promise((resolve, reject) => {
        try {
            favouritesSchema_1.default.deleteOne({
                addedUserId: new mongoose_1.default.Types.ObjectId(removedUserId)
            }).then((response) => {
                resolve({ data: 'done' });
            }).catch((error) => {
                reject({ status: 500, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Interal error occured!" });
        }
    });
};
exports.removeFavouritesService = removeFavouritesService;
const getFavouritesService = ({ userId, page, pageSize }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { location } = (yield userSchema_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(userId)
                    }
                }, {
                    $lookup: {
                        from: "addresses",
                        localField: "selectedAddress",
                        foreignField: "_id",
                        as: "address"
                    }
                }, {
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
            favouritesSchema_1.default.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(userId)
                    }
                }, {
                    $lookup: {
                        from: "users",
                        localField: "addedUserId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                }, {
                    $project: {
                        userId: "addedUserId",
                        userDetails: {
                            $first: "$userDetails"
                        }
                    }
                }, {
                    $project: {
                        userId: "$userId",
                        gender: "$userDetails.gender",
                        openToWork: "$userDetails.openToWork",
                        bio: "$userDetails.bio",
                        firstName: "$userDetails.firstName",
                        lastName: "$userDetails.lastName",
                        categoryList: "$userDetails.categoryList",
                        isVerified: "$userDetails.isVerified",
                        profilePicture: "$userDetails.profilePicture",
                    }
                }, {
                    $lookup: {
                        from: "workers",
                        localField: "primaryCategory",
                        foreignField: "_id",
                        as: "primaryCategoryData"
                    }
                }, {
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "ratedUserId",
                        as: "ratings"
                    }
                }, {
                    $lookup: {
                        from: "addresses",
                        localField: "selectedAddress",
                        foreignField: "_id",
                        as: "address"
                    }
                }, {
                    $lookup: {
                        from: "favourites",
                        localField: "_id",
                        foreignField: "addedUserId",
                        as: "isFavourite"
                    }
                }, {
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
                }, {
                    $addFields: {
                        address: {
                            $ifNull: ["$address", null]
                        }
                    }
                }, {
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
                }, {
                    $skip: (page !== undefined && pageSize !== undefined) ? (page * pageSize) : 0
                }, {
                    $limit: pageSize ? parseInt(pageSize) : 1
                }
            ]).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject({ status: 500, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Interal error occured!" });
        }
    }));
};
exports.getFavouritesService = getFavouritesService;
