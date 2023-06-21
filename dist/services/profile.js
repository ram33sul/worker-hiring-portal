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
exports.addSampleWorkService = exports.getUserDetailsService = exports.openToWorkOffService = exports.openToWorkOnService = exports.registerAsWorkerService = exports.editProfileService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inputs_1 = require("../validation/inputs");
const types_1 = require("../validation/types");
const userSchema_1 = __importDefault(require("../model/userSchema"));
const general_1 = require("../validation/general");
const cloudinary_1 = require("./cloudinary");
const editProfileService = ({ userId, data, file }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let { firstName, lastName, gender, email, isWorker, age } = JSON.parse(data);
        const profilePicture = file;
        try {
            const errors = (0, general_1.validate)([
                ['firstName', types_1.validateString, firstName],
                ['lastname', types_1.validateString, lastName],
                ['gender', inputs_1.validateGender, gender],
                ['isWorker', types_1.validateBoolean, isWorker],
                ['email', inputs_1.validateEmail, email],
                ['age', inputs_1.validateAge, age]
            ]);
            if (errors.length) {
                return reject({ errors, status: 400, error: new Error("invalid inputs!") });
            }
            let profilePicUrl = '';
            if (profilePicture) {
                yield (0, cloudinary_1.uploadToCloudinary)(`profilePictures/${userId}.png`).then((result) => {
                    profilePicUrl = result.url;
                }).catch((error) => {
                    reject([{ message: "Can't be uploaded to cloudinary!" }]);
                    return;
                });
            }
            userId = new mongoose_1.default.Types.ObjectId(userId);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: Object.assign({ firstName: firstName, lastName: lastName, gender: gender, isWorker: isWorker, email: email }, (profilePicUrl && {
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
const registerAsWorkerService = ({ data, file, userId }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { bio, age, categoryList, firstName, lastName, email, gender, openToWork, primaryCategory } = JSON.parse(data);
            const profilePicture = file;
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
                yield (0, cloudinary_1.uploadToCloudinary)(`profilePictures/${userId}.png`).then((result) => {
                    profilePicUrl = result.url;
                }).catch((error) => {
                    reject([{ error: "Can't be uploaded to cloudinary!", status: 400 }]);
                    return;
                });
            }
            categoryList = categoryList.map((elem) => (Object.assign(Object.assign({}, elem), { id: new mongoose_1.default.Types.ObjectId(elem.id) })));
            userId = new mongoose_1.default.Types.ObjectId(userId);
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $set: Object.assign({ bio,
                    age,
                    categoryList,
                    firstName,
                    lastName,
                    email,
                    gender,
                    openToWork, isWorker: true, primaryCategory: new mongoose_1.default.Types.ObjectId(primaryCategory) }, (profilePicUrl && {
                    profilePicture: profilePicUrl
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
const getUserDetailsService = ({ id }) => {
    return new Promise((resolve, reject) => {
        try {
            id = new mongoose_1.default.Types.ObjectId(id);
            userSchema_1.default.aggregate([
                {
                    $match: {
                        _id: id
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
const addSampleWorkService = ({ data, userId, file }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let imageUrl = '';
            const image = file;
            if (image) {
                yield (0, cloudinary_1.uploadToCloudinary)(`sampleWorks/${userId}.png`).then((result) => {
                    imageUrl = result.url;
                }).catch((error) => {
                    reject([{ error: "Can't be uploaded to cloudinary!", status: 400 }]);
                    return;
                });
            }
            userSchema_1.default.updateOne({
                _id: userId
            }, {
                $push: {
                    sampleWorks: (imageUrl ? Object.assign(Object.assign({}, data), { imageUrl }) : Object.assign({}, data))
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
    }));
};
exports.addSampleWorkService = addSampleWorkService;
