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
exports.refreshTokenService = exports.verifyUserService = exports.verifySmsOtpService = exports.sendSmsOtpService = void 0;
const twilio_1 = __importDefault(require("twilio"));
const userSchema_1 = __importDefault(require("../model/userSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../authentication/jwt");
const sendSmsOtpService = ({ mobile, countryCode }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = [];
            if (!mobile) {
                errors.push(`"mobile" is required!`);
            }
            if (!countryCode) {
                errors.push(`"countryCode" is required!`);
            }
            if (errors.length) {
                return reject(errors);
            }
            const accountSid = process.env.TWILIO_SID;
            const authToken = process.env.TWILIO_TOKEN;
            const verifySid = process.env.TWILIO_VERIFY_SID;
            const client = (0, twilio_1.default)(accountSid, authToken);
            client.verify.v2
                .services(verifySid)
                .verifications.create({
                to: countryCode + mobile,
                channel: "sms"
            })
                .then((verification) => console.log(verification.status))
                .then(() => {
                resolve({ data: countryCode + mobile });
            })
                .catch((error) => {
                reject("Can't send OTP!");
            });
        }
        catch (error) {
            reject("Internal error occured at sendSmsOtpService!");
        }
    }));
};
exports.sendSmsOtpService = sendSmsOtpService;
const verifySmsOtpService = ({ mobile, countryCode, otpCode }) => {
    return new Promise((resolve, reject) => {
        try {
            const errors = [];
            if (!mobile) {
                errors.push(`'mobile' is required!`);
            }
            if (!countryCode) {
                errors.push(`'countryCode' is required!`);
            }
            if (!otpCode) {
                errors.push(`'otpCode' is required`);
            }
            if (errors.length) {
                return reject(errors);
            }
            const accountSid = process.env.TWILIO_SID;
            const authToken = process.env.TWILIO_TOKEN;
            const verifySid = process.env.TWILIO_VERIFY_SID;
            const client = (0, twilio_1.default)(accountSid, authToken);
            client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: countryCode + mobile, code: otpCode })
                .then((verification_check) => __awaiter(void 0, void 0, void 0, function* () {
                if (verification_check.status === 'approved') {
                    const userData = yield userSchema_1.default.findOne({ mobile: mobile, countryCode: countryCode });
                    if (!userData || !Object.keys(userData).length) {
                        userSchema_1.default.create({
                            mobile: mobile,
                            countryCode: countryCode
                        }).then((response) => {
                            const accessToken = (0, jwt_1.jwtSignAccess)({ userId: response._id });
                            const refreshToken = (0, jwt_1.jwtSignRefresh)({ userId: response._id });
                            resolve({ data: response, headers: { accessToken, refreshToken } });
                        }).catch((error) => {
                            reject("Error occured in database!");
                        });
                    }
                    else {
                        if (!userData.status) {
                            reject("User is blocked!");
                        }
                        else {
                            const accessToken = (0, jwt_1.jwtSignAccess)({ userId: userData._id });
                            const refreshToken = (0, jwt_1.jwtSignRefresh)({ userId: userData._id });
                            resolve({ data: userData, headers: { accessToken, refreshToken } });
                        }
                    }
                }
                else {
                    reject("OTP is incorrect!");
                }
            })).catch((error) => {
                reject("OTP expired!");
            });
        }
        catch (error) {
            reject("Internal error occured!");
        }
    });
};
exports.verifySmsOtpService = verifySmsOtpService;
const verifyUserService = ({ token }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!token) {
                return reject('Token is missing!');
            }
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_KEY, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject("Token is not valid or expired!");
                }
                else {
                    resolve({ data: data.userId });
                }
            }));
        }
        catch (error) {
            reject('Internal error occured!');
        }
    }));
};
exports.verifyUserService = verifyUserService;
const refreshTokenService = ({ token }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!token) {
                return reject("Token is missing!");
            }
            jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_KEY, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject("Token is not valid or expired!");
                }
                else {
                    const accessToken = (0, jwt_1.jwtSignAccess)({ userId: data.userId });
                    resolve({ data: { userId: data.userId }, headers: { accessToken } });
                }
            }));
        }
        catch (error) {
            reject("Internal error occured!");
        }
    }));
};
exports.refreshTokenService = refreshTokenService;
