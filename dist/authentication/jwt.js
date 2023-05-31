"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSignRefresh = exports.jwtSignAccess = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSignAccess = ({ userId }) => {
    return jsonwebtoken_1.default.sign({
        userId
    }, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: '30m'
    });
};
exports.jwtSignAccess = jwtSignAccess;
const jwtSignRefresh = ({ userId }) => {
    return jsonwebtoken_1.default.sign({
        userId
    }, process.env.REFRESH_TOKEN_KEY, {
        expiresIn: '2 years'
    });
};
exports.jwtSignRefresh = jwtSignRefresh;
