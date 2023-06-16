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
exports.authenticateService = exports.refreshTokenService = exports.verifyUserService = exports.verifySmsOtpService = exports.sendSmsOtpService = void 0;
const twilio_1 = __importDefault(require("twilio"));
const userSchema_1 = __importDefault(require("../model/userSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../authentication/jwt");
const sendSmsOtpService = ({ phone, countryCode }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = [];
            if (!phone) {
                errors.push("phone is required!");
            }
            if (!countryCode) {
                errors.push("countryCode is required!");
            }
            if (errors.length) {
                return reject({ errors, error: new Error("Invalid inputs!"), status: 400 });
            }
            const accountSid = process.env.TWILIO_SID;
            const authToken = process.env.TWILIO_TOKEN;
            const verifySid = process.env.TWILIO_VERIFY_SID;
            const client = (0, twilio_1.default)(accountSid, authToken);
            client.verify.v2
                .services(verifySid)
                .verifications.create({
                to: countryCode + phone,
                channel: "sms"
            })
                .then((verification) => console.log(verification.status))
                .then(() => {
                resolve({ data: countryCode + phone });
            })
                .catch((error) => {
                console.log(error.message);
                reject({ status: 400, error: new Error("Can't send OTP to that number!") });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    }));
};
exports.sendSmsOtpService = sendSmsOtpService;
const verifySmsOtpService = ({ phone, countryCode, otpCode }) => {
    return new Promise((resolve, reject) => {
        try {
            const errors = [];
            if (!phone) {
                errors.push(`phone is required!`);
            }
            if (!countryCode) {
                errors.push(`countryCode is required!`);
            }
            if (!otpCode) {
                errors.push(`otpCode is required`);
            }
            if (errors.length) {
                return reject({ errors, error: new Error("Invalid inputs"), status: 400 });
            }
            const accountSid = process.env.TWILIO_SID;
            const authToken = process.env.TWILIO_TOKEN;
            const verifySid = process.env.TWILIO_VERIFY_SID;
            const client = (0, twilio_1.default)(accountSid, authToken);
            client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: countryCode + phone, code: otpCode })
                .then((verification_check) => __awaiter(void 0, void 0, void 0, function* () {
                if (verification_check.status === 'approved') {
                    const userData = yield userSchema_1.default.findOne({ phone: phone, countryCode: countryCode });
                    if (!userData || !Object.keys(userData).length) {
                        userSchema_1.default.create({
                            phone: phone,
                            countryCode: countryCode
                        }).then((response) => {
                            const accessToken = (0, jwt_1.jwtSignAccess)({ userId: response._id });
                            const refreshToken = (0, jwt_1.jwtSignRefresh)({ userId: response._id });
                            resolve({ data: response, headers: { "access-token": accessToken, "refresh-token": refreshToken } });
                        }).catch((error) => {
                            reject({ status: 502, error: new Error("Database error occured!") });
                        });
                    }
                    else {
                        if (!userData.status) {
                            reject({ error: new Error("User is blocked!"), status: 403 });
                        }
                        else {
                            const accessToken = (0, jwt_1.jwtSignAccess)({ userId: userData._id });
                            const refreshToken = (0, jwt_1.jwtSignRefresh)({ userId: userData._id });
                            resolve({ data: userData, headers: { "access-token": accessToken, "refresh-token": refreshToken } });
                        }
                    }
                }
                else {
                    reject({ error: new Error("OTP is incorrect!"), status: 400 });
                }
            })).catch((error) => {
                reject({ error: new Error("OTP expired!"), status: 410 });
            });
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    });
};
exports.verifySmsOtpService = verifySmsOtpService;
const verifyUserService = ({ token }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!token) {
                return reject({ error: new Error("Token is missing"), status: 401 });
            }
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_KEY, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject({ error: new Error("Token is not valid or expired!"), status: 401 });
                }
                else {
                    const userData = yield userSchema_1.default.findOne({
                        _id: new mongoose_1.default.Types.ObjectId(data.userId)
                    });
                    if (!userData) {
                        return reject({ error: new Error("User doesn't exist!"), status: 404 });
                    }
                    if (!(userData === null || userData === void 0 ? void 0 : userData.status)) {
                        return reject({ error: new Error("User is blocked!"), status: 403 });
                    }
                    resolve({ data: data.userId });
                }
            }));
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    }));
};
exports.verifyUserService = verifyUserService;
const refreshTokenService = ({ token }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!token) {
                return reject({ error: new Error("Token is missing"), status: 401 });
            }
            jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_KEY, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject({ error: new Error("Token is not valid or expired!"), status: 401 });
                }
                else {
                    const accessToken = (0, jwt_1.jwtSignAccess)({ userId: data.userId });
                    resolve({ data: { userId: data.userId }, headers: { "access-token": accessToken } });
                }
            }));
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    }));
};
exports.refreshTokenService = refreshTokenService;
const authenticateService = ({ token }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!token) {
                return reject({ error: new Error("Token is missing"), status: 401 });
            }
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_KEY, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject({ error: new Error("Token is not valid or expired!"), status: 401 });
                }
                else {
                    const _id = new mongoose_1.default.Types.ObjectId(data.userId);
                    userSchema_1.default.findOne({ _id }).then((response) => {
                        resolve({ data: response });
                    }).catch((error) => {
                        reject({ status: 502, error: new Error("Database error occured!") });
                    });
                }
            }));
        }
        catch (error) {
            reject({ status: 500, error: new Error("Internal error occured!") });
        }
    }));
};
exports.authenticateService = authenticateService;
