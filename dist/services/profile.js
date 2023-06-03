"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetailsService = exports.openToWorkOffService = exports.openToWorkOnService = exports.registerAsWorkerService = exports.editProfileService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inputs_1 = require("../validation/inputs");
const types_1 = require("../validation/types");
const userSchema_1 = __importDefault(require("../model/userSchema"));
const general_1 = require("../validation/general");
const editProfileService = ({ firstName, lastName, gender, email, profilePicture, isWorker, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            const errors = (0, general_1.validate)([
                ['firstName', types_1.validateString, firstName],
                ['lastname', types_1.validateString, lastName],
                ['gender', inputs_1.validateGender, gender],
                ['profilePicture', types_1.validateString, profilePicture],
                ['isWorker', types_1.validateBoolean, isWorker],
                ['email', inputs_1.validateEmail, email]
            ]);
            if (errors.length) {
                return reject({ errors, status: 400, error: new Error("invalid inputs!") });
            }
            userId = new mongoose_1.default.Types.ObjectId(userId);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    profilePicture: profilePicture,
                    isWorker: isWorker,
                    email: email
                }
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
    });
};
exports.editProfileService = editProfileService;
const registerAsWorkerService = ({ bio, age, categoryList, sampleWorkImages, dailyWage, hourlyWage, primaryCategory, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            if (!((0, inputs_1.validateBio)(bio) && (0, inputs_1.validateAge)(age) && (0, types_1.validateStringArray)(categoryList) && (0, types_1.validateStringArray)(sampleWorkImages) && (0, types_1.validatePositiveNumber)(dailyWage) && (0, types_1.validatePositiveNumber)(hourlyWage) && (0, types_1.validateString)(primaryCategory))) {
                return reject({ status: 400, error: new Error("invalid inputs!") });
            }
            userId = new mongoose_1.default.Types.ObjectId(userId);
            const primaryCategoryObject = new mongoose_1.default.Types.ObjectId(primaryCategory);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: {
                    bio,
                    age,
                    categoryList,
                    sampleWorkImages,
                    dailyWage,
                    hourlyWage,
                    primaryCategory: primaryCategoryObject
                }
            }).then(() => {
                return userSchema_1.default.findOne({ _id: userId });
            }).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                console.log(error);
                reject({ status: 502, error: new Error("Database error occured!") });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    });
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
    });
};
exports.openToWorkOffService = openToWorkOffService;
const userDetailsService = ({ userId }) => {
    return new Promise((resolve, reject) => {
        try {
            userId = new mongoose_1.default.Types.ObjectId(userId);
            userSchema_1.default.findOne({ _id: userId }).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject({ status: 502, error: new Error("Database error occured!") });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    });
};
exports.userDetailsService = userDetailsService;
