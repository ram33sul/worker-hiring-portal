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
exports.deleteSampleWorkService = exports.getSampleWorkService = exports.getSampleWorksService = exports.addSampleWorkService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sampleWorksSchema_1 = __importDefault(require("../model/sampleWorksSchema"));
const cloudinary_1 = require("./cloudinary");
const addSampleWorkService = ({ data, userId, file }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let imageUrl = '';
            const image = file;
            const { title, description } = JSON.parse(data);
            if (image) {
                yield (0, cloudinary_1.uploadToCloudinary)(`sampleWorkImage/${userId}.png`).then((result) => {
                    imageUrl = result.url;
                }).catch((error) => {
                    reject([{ error: "Can't be uploaded to cloudinary!", status: 400 }]);
                    return;
                });
            }
            sampleWorksSchema_1.default.create({
                title,
                description,
                imageUrl,
                userId: new mongoose_1.default.Types.ObjectId(userId),
                timestamp: new Date()
            }).then((response) => {
                response = response.toObject();
                response.timestamp = response.timestamp.getTime();
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
exports.addSampleWorkService = addSampleWorkService;
const getSampleWorksService = ({ id, page, pageSize }) => {
    return new Promise((resolve, reject) => {
        try {
            sampleWorksSchema_1.default.find({
                userId: new mongoose_1.default.Types.ObjectId(id)
            }).skip(page * pageSize).limit(pageSize).lean().then((response) => {
                var _a;
                response = (_a = response === null || response === void 0 ? void 0 : response.map) === null || _a === void 0 ? void 0 : _a.call(response, (res) => { var _a, _b; return (Object.assign(Object.assign({}, res), { timestamp: (_b = (_a = res === null || res === void 0 ? void 0 : res.timestamp) === null || _a === void 0 ? void 0 : _a.getTime) === null || _b === void 0 ? void 0 : _b.call(_a) })); });
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
exports.getSampleWorksService = getSampleWorksService;
const getSampleWorkService = ({ id }) => {
    return new Promise((resolve, reject) => {
        try {
            sampleWorksSchema_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(id)
            }).lean().then((response) => {
                var _a, _b;
                response.timestamp = (_b = (_a = response === null || response === void 0 ? void 0 : response.timestamp) === null || _a === void 0 ? void 0 : _a.getTime) === null || _b === void 0 ? void 0 : _b.call(_a);
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
exports.getSampleWorkService = getSampleWorkService;
const deleteSampleWorkService = ({ id, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            sampleWorksSchema_1.default.deleteOne({
                _id: new mongoose_1.default.Types.ObjectId(id),
                userId
            }).then((response) => {
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
exports.deleteSampleWorkService = deleteSampleWorkService;
