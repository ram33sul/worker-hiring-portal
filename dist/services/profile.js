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
exports.getWorkersListService = exports.getUserDetailsService = exports.openToWorkOffService = exports.openToWorkOnService = exports.registerAsWorkerService = exports.editProfileService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inputs_1 = require("../validation/inputs");
const types_1 = require("../validation/types");
const userSchema_1 = __importDefault(require("../model/userSchema"));
const general_1 = require("../validation/general");
const cloudinary_1 = require("./cloudinary");
const editProfileService = ({ userId, data, file }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let { firstName, lastName, gender, email, age } = JSON.parse(data);
        const profilePicture = file;
        try {
            const errors = (0, general_1.validate)([
                ['firstName', types_1.validateString, firstName],
                ['lastname', types_1.validateString, lastName],
                ['gender', inputs_1.validateGender, gender],
                ['email', inputs_1.validateEmail, email],
                ['age', inputs_1.validateAge, age]
            ]);
            if (errors.length) {
                return reject({ errors, status: 400, error: "invalid inputs!" });
            }
            let profilePicUrl = '';
            if (profilePicture) {
                yield (0, cloudinary_1.uploadToCloudinary)(`profilePicture/${userId}.png`).then((result) => {
                    profilePicUrl = result.url;
                }).catch((error) => {
                    reject([{ error: "Can't be uploaded to cloudinary!", status: 500 }]);
                    return;
                });
            }
            userId = new mongoose_1.default.Types.ObjectId(userId);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: Object.assign({ firstName: firstName, lastName: lastName, gender: gender, email: email, age: age }, (profilePicUrl && {
                    profilePicture: profilePicUrl
                }))
            }).then(() => {
                return userSchema_1.default.findOne({ _id: userId });
            }).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject({ status: 502, error: new Error("Database error occured!") });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    }));
};
exports.editProfileService = editProfileService;
const registerAsWorkerService = ({ data, files, userId }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            let { bio, age, categoryList, firstName, lastName, email, gender, openToWork, primaryCategory } = JSON.parse(data);
            const profilePicture = (_a = files.profilePicture) === null || _a === void 0 ? void 0 : _a[0];
            const identity = (_b = files.identity) === null || _b === void 0 ? void 0 : _b[0];
            if (!((0, inputs_1.validateBio)(bio) && (0, inputs_1.validateAge)(age) && (0, inputs_1.validateName)(firstName) && (0, inputs_1.validateName)(lastName) && (0, inputs_1.validateEmail)(email) && (gender === undefined || (0, inputs_1.validateGender)(gender)) && (openToWork === undefined || (0, types_1.validateBoolean)(openToWork)))) {
                return reject({ status: 400, error: "invalid inputs!" });
            }
            if (!Array.isArray(categoryList)) {
                return reject({ status: 400, error: "category list must be an array!" });
            }
            const isPrimaryCategory = categoryList.filter((elem) => elem.id === primaryCategory);
            if (primaryCategory && isPrimaryCategory.length !== 1) {
                return reject({ status: 400, error: "Primary skill must be only one and should be included in the category list!" });
            }
            let profilePicUrl = '';
            if (profilePicture) {
                yield (0, cloudinary_1.uploadToCloudinary)(`profilePicture/${userId}.png`).then((result) => {
                    profilePicUrl = result.url;
                }).catch((error) => {
                    reject([{ error: "Can't be uploaded to cloudinary!", status: 500 }]);
                    return;
                });
            }
            let identityUrl = '';
            if (identity) {
                yield (0, cloudinary_1.uploadToCloudinary)(`identity/${userId}.png`).then((result) => {
                    identityUrl = result.url;
                }).catch((error) => {
                    reject([{ error: "Can't be uploaded to cloudinary!", status: 500 }]);
                    return;
                });
            }
            categoryList = categoryList.map((elem) => (Object.assign(Object.assign({}, elem), { id: new mongoose_1.default.Types.ObjectId(elem.id) })));
            userId = new mongoose_1.default.Types.ObjectId(userId);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: Object.assign(Object.assign({ bio,
                    age,
                    categoryList,
                    firstName,
                    lastName,
                    email,
                    gender,
                    openToWork, isWorker: true, primaryCategory: new mongoose_1.default.Types.ObjectId(primaryCategory) }, (profilePicUrl && {
                    profilePicture: profilePicUrl
                })), (identityUrl && {
                    identityUrl: identityUrl
                }))
            }).then(() => {
                return userSchema_1.default.findOne({ _id: userId });
            }).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occured!" });
            });
        }
        catch (error) {
            console.log(error);
            reject({ status: 500, error: "Internal error occured!" });
        }
    }));
};
exports.registerAsWorkerService = registerAsWorkerService;
const openToWorkOnService = ({ userId }) => {
    return new Promise((resolve, reject) => {
        try {
            userId = new mongoose_1.default.Types.ObjectId(userId);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: {
                    openToWork: true
                }
            }).then(() => {
                resolve({ data: 'done' });
            }).catch((error) => {
                reject({ status: 502, error: new Error("Database error occured!") });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    });
};
exports.openToWorkOnService = openToWorkOnService;
const openToWorkOffService = ({ userId }) => {
    return new Promise((resolve, reject) => {
        try {
            userId = new mongoose_1.default.Types.ObjectId(userId);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: {
                    openToWork: false
                }
            }).then(() => {
                resolve({ data: 'done' });
            }).catch((error) => {
                reject({ status: 502, error: new Error("Database error occured!") });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    });
};
exports.openToWorkOffService = openToWorkOffService;
const getUserDetailsService = ({ id, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            const _id = new mongoose_1.default.Types.ObjectId(id);
            userSchema_1.default.aggregate([
                {
                    $match: {
                        _id: _id
                    }
                }, {
                    $lookup: {
                        from: "workers",
                        localField: "categoryList.id",
                        foreignField: "_id",
                        as: "categoryListDetails"
                    }
                }
            ]).then((response) => {
                for (let i = 0; i < response[0].categoryList.length; i++) {
                    for (let j = 0; j < response[0].categoryListDetails.length; j++) {
                        if (JSON.stringify(response[0].categoryList[i].id) === JSON.stringify(response[0].categoryListDetails[j]._id)) {
                            response[0].categoryList[i] = Object.assign(Object.assign({}, response[0].categoryList[i]), response[0].categoryListDetails[j]);
                        }
                    }
                }
                if (id !== userId) {
                    delete response[0].identityUrl;
                }
                resolve({ data: response[0] });
            }).catch((error) => {
                reject({ status: 502, error: new Error("Database error occured!") });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    });
};
exports.getUserDetailsService = getUserDetailsService;
const getWorkersListService = ({ page, pageSize, sort, rating4Plus, previouslyHired, userId, category }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(rating4Plus);
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
            userSchema_1.default.aggregate([
                {
                    $match: Object.assign({ isWorker: true, openToWork: true }, (category ? {
                        categoryList: {
                            $elemMatch: {
                                id: new mongoose_1.default.Types.ObjectId
                            }
                        }
                    } : {}))
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
                        firstName: 1,
                        lastName: 1,
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
                        primaryCategoryName: {
                            $arrayElemAt: [
                                "$primaryCategoryData.title",
                                0
                            ]
                        },
                        primaryCategoryDailyWage: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: "$categoryList",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$this.id",
                                                        "$primaryCategory"
                                                    ]
                                                },
                                                "$$this.dailyWage",
                                                null
                                            ]
                                        }
                                    }
                                },
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
                    $match: Object.assign({ ratingAverage: {
                            $gte: rating4Plus === 'true' ? 5 : 0
                        } }, (previouslyHired === 'true' ? {
                        previouslyHired: true
                    } : {}))
                }, {
                    $sort: (sort === 'rating' ?
                        {
                            ratingAverage: -1
                        } : sort === 'wageLowToHigh' ?
                        {
                            primaryCategoryDailyWage: 1
                        } : sort === 'wageHighToLow' ?
                        {
                            primaryCategoryDailyWage: -1
                        } : { ratingAverage: -1 })
                }, {
                    $skip: (page !== undefined && pageSize !== undefined) ? (page * pageSize) : 0
                }, {
                    $limit: pageSize !== null && pageSize !== void 0 ? pageSize : 1
                }
            ]).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                console.log(error);
                reject({ status: 502, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occured!" });
        }
    }));
};
exports.getWorkersListService = getWorkersListService;
