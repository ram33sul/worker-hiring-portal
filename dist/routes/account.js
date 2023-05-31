"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = require("../controllers/account");
const events_1 = require("../controllers/events");
const router = express_1.default.Router();
router.post('/send-sms-otp', (0, account_1.eventHandler)(events_1.SEND_SMS_OTP));
router.post('/verify-sms-otp', (0, account_1.eventHandler)(events_1.VERIFY_SMS_OTP));
router.post('/refresh-token', (0, account_1.eventHandler)(events_1.REFRESH_TOKEN));
exports.default = router;
