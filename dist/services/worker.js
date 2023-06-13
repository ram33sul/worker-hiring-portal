"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategorySearchService = exports.getSuggestedCategoriesService = exports.getWorkerCategoriesService = exports.addWorkerCategoryService = void 0;
const workerCategorySchema_1 = __importDefault(require("../model/workerCategorySchema"));
const general_1 = require("../validation/general");
const types_1 = require("../validation/types");
const addWorkerCategoryService = ({ title, dailyMinWage, hourlyMinWage, skill }) => {
    return new Promise((resolve, reject) => {
        try {
            let errors = [];
            if (title === undefined) {
                errors[errors.length] = 'title is required!';
            }
            if (skill === undefined) {
                errors[errors.length] = 'skill is required!';
            }
            if (errors.length) {
                return reject({ status: 400, error: new Error("Inputs are required!"), errors });
            }
            errors = (0, general_1.validate)([
                ['title', types_1.validateString, title],
                ['minimumWage', types_1.validateNumber, dailyMinWage],
                ['minimumWage', types_1.validateNumber, hourlyMinWage],
                ['skill', types_1.validateString, skill]
            ]);
            if (errors.length) {
                return reject({ status: 400, error: new Error("Inputs are invalid!"), errors });
            }
            workerCategorySchema_1.default.create({
                title: title,
                dailyMinWage: dailyMinWage,
                hourlyMinWage: hourlyMinWage,
                skill: skill
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
exports.addWorkerCategoryService = addWorkerCategoryService;
const getWorkerCategoriesService = () => {
    return new Promise((resolve, reject) => {
        try {
            workerCategorySchema_1.default.find().then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    });
};
exports.getWorkerCategoriesService = getWorkerCategoriesService;
const getSuggestedCategoriesService = () => {
    return new Promise((resolve, reject) => {
        try {
            workerCategorySchema_1.default.find().limit(10).then((response) => {
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
exports.getSuggestedCategoriesService = getSuggestedCategoriesService;
const getCategorySearchService = ({ key }) => {
    return new Promise((resolve, reject) => {
        try {
            workerCategorySchema_1.default.find({
                $or: [
                    {
                        title: {
                            $regex: `/${key}/`
                        }
                    }, {
                        skill: {
                            $regex: `/${key}`
                        }
                    }
                ]
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
exports.getCategorySearchService = getCategorySearchService;
