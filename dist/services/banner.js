"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBannersService = exports.addBannerService = void 0;
const bannerSchema_1 = __importDefault(require("../model/bannerSchema"));
const addBannerService = ({ title, description, imageUrl, deeplinkUrl }) => {
    return new Promise((resolve, reject) => {
        try {
            bannerSchema_1.default.create({
                title,
                description,
                imageUrl,
                deeplinkUrl
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
exports.addBannerService = addBannerService;
const getBannersService = () => {
    return new Promise((resolve, reject) => {
        try {
            bannerSchema_1.default.find().then((response) => {
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
exports.getBannersService = getBannersService;
