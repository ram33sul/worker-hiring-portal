"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavouritesService = exports.removeFavouritesService = exports.addToFavouritesService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const favouritesSchema_1 = __importDefault(require("../model/favouritesSchema"));
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
    return new Promise((resolve, reject) => {
        try {
            favouritesSchema_1.default.find({
                _id: new mongoose_1.default.Types.ObjectId(userId)
            }).skip(page * pageSize).limit(pageSize).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject({ status: 500, error: "Database error occured!" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Interal error occured!" });
        }
    });
};
exports.getFavouritesService = getFavouritesService;
