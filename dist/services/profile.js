"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetailsService = exports.openToWorkOffService = exports.openToWorkOnService = exports.registerAsWorkerService = exports.editProfileService = void 0;
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
const registerAsWorkerService = ({ bio, age, categoryList, userId, firstName, lastName, email, gender, openToWork, primaryCategory }) => {
    return new Promise((resolve, reject) => {
        try {
            if (!((0, inputs_1.validateBio)(bio) && (0, inputs_1.validateAge)(age) && (0, inputs_1.validateName)(firstName) && (0, inputs_1.validateName)(lastName) && (0, inputs_1.validateEmail)(email) && (gender === undefined || (0, inputs_1.validateGender)(gender)) && (openToWork === undefined || (0, types_1.validateBoolean)(openToWork)))) {
                return reject({ status: 400, error: "invalid inputs!" });
            }
            userId = new mongoose_1.default.Types.ObjectId(userId);
            if (!Array.isArray(categoryList)) {
                return reject({ status: 400, error: "category list must be an array!" });
            }
            const isPrimaryCategory = categoryList.filter((elem) => elem.id === primaryCategory);
            if (primaryCategory && isPrimaryCategory.length !== 1) {
                return reject({ status: 400, error: "Primary skill must be only one and should be included in the category list!" });
            }
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: {
                    bio,
                    age,
                    categoryList,
                    firstName,
                    lastName,
                    email,
                    gender,
                    openToWork,
                    isWorker: true,
                    primaryCategory: new mongoose_1.default.Types.ObjectId(primaryCategory)
                }
            }).then(() => {
                return userSchema_1.default.findOne({ _id: userId });
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
const getUserDetailsService = ({ id }) => {
    return new Promise((resolve, reject) => {
        try {
            id = new mongoose_1.default.Types.ObjectId(id);
            userSchema_1.default.findOne({ _id: id }).then((response) => {
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
exports.getUserDetailsService = getUserDetailsService;
