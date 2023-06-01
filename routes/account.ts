import express from 'express';
import { eventHandler } from '../controllers/account';
import { AUTHENTICATE, EDIT_PROFILE, OPEN_TO_WORK_OFF, OPEN_TO_WORK_ON, REFRESH_TOKEN, REGISTER_AS_WORKER, SEND_SMS_OTP, VERIFY_SMS_OTP, VERIFY_USER } from '../controllers/events';
import { auth } from '../authentication/auth';

const router = express.Router();

router.post('/send-sms-otp', eventHandler(SEND_SMS_OTP));

router.post('/verify-sms-otp', eventHandler(VERIFY_SMS_OTP));

router.get('/refresh-token', eventHandler(REFRESH_TOKEN));

router.get('/authenticate', eventHandler(AUTHENTICATE));

export default router;