import express from 'express';
import { eventHandler } from '../controllers/account';
import { REFRESH_TOKEN, SEND_SMS_OTP, VERIFY_SMS_OTP } from '../controllers/events';

const router = express.Router();

router.post('/send-sms-otp', eventHandler(SEND_SMS_OTP));

router.post('/verify-sms-otp', eventHandler(VERIFY_SMS_OTP));

router.post('/refresh-token', eventHandler(REFRESH_TOKEN));

export default router;