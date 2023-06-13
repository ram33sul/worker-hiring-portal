"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressService = exports.getAllAddressesService = exports.addAddressService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const addressSchema_1 = __importDefault(require("../model/addressSchema"));
const addAddressService = ({ title, completeAddress, floor, landmark, place, subLocality, city, state, country, pin, location, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            addressSchema_1.default.create({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                title,
                completeAddress,
                floor,
                landmark,
                place,
                subLocality,
                city,
                state,
                country,
                pin,
                location
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
exports.addAddressService = addAddressService;
const getAllAddressesService = ({ userId }) => {
    return new Promise((resolve, reject) => {
        try {
            addressSchema_1.default.find({
                userId: new mongoose_1.default.Types.ObjectId(userId),
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
exports.getAllAddressesService = getAllAddressesService;
const getAddressService = ({ id }) => {
    return new Promise((resolve, reject) => {
        try {
            addressSchema_1.default.find({
                _id: new mongoose_1.default.Types.ObjectId(id),
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
exports.getAddressService = getAddressService;
