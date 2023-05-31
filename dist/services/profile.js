"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openToWorkOffService = exports.openToWorkOnService = exports.registerAsWorkerService = exports.editProfileService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inputs_1 = require("../validation/inputs");
const types_1 = require("../validation/types");
const userSchema_1 = __importDefault(require("../model/userSchema"));
const general_1 = require("../validation/general");
const editProfileService = ({ firstName, lastName, gender, profilePicture, isWorker, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            const errors = (0, general_1.validate)([
                ['firstName', types_1.validateString, firstName],
                ['lastname', types_1.validateString, lastName],
                ['gender', inputs_1.validateGender, gender],
                ['profilePicture', types_1.validateString, profilePicture],
                ['isWorker', types_1.validateBoolean, isWorker]
            ]);
            if (errors.length) {
                return reject(errors);
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
                    isWorker: isWorker
                }
            }).then(() => {
                return userSchema_1.default.findOne({ _id: userId });
            }).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject("Database error occured!");
            });
        }
        catch (error) {
            reject("Internal error occured!");
        }
    });
};
exports.editProfileService = editProfileService;
const registerAsWorkerService = ({ bio, age, skillsList, sampleWorkImages, dailyWage, hourlyWage, primarySkill, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            if (!((0, inputs_1.validateBio)(bio) && (0, inputs_1.validateAge)(age) && (0, types_1.validateStringArray)(skillsList) && (0, types_1.validateStringArray)(sampleWorkImages) && (0, types_1.validatePositiveNumber)(dailyWage) && (0, types_1.validatePositiveNumber)(hourlyWage) && (0, types_1.validateString)(primarySkill))) {
                return reject("Validation failed!");
            }
            userId = new mongoose_1.default.Types.ObjectId(userId);
            const primarySkillObject = new mongoose_1.default.Types.ObjectId(primarySkill);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: {
                    bio,
                    age,
                    skillsList,
                    sampleWorkImages,
                    dailyWage,
                    hourlyWage,
                    primarySkill: primarySkillObject
                }
            }).then(() => {
                return userSchema_1.default.findOne({ _id: userId });
            }).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                console.log(error);
                reject("Database error occured!");
            });
        }
        catch (error) {
            reject("Internal error occured!");
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
                reject("Database error occured!");
            });
        }
        catch (error) {
            reject("Internal error occured!");
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
                reject("Database error occured!");
            });
        }
        catch (error) {
            reject("Internal error occured!");
        }
    });
};
exports.openToWorkOffService = openToWorkOffService;
