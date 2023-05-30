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
exports.sendSmsOtpService = void 0;
const twilio_1 = __importDefault(require("twilio"));
const sendSmsOtpService = ({ mobile, countryCode }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!mobile) {
                return reject("Mobile is required!");
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
                resolve(countryCode + mobile);
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
