import express from 'express';
import { eventHandler } from '../controllers/account';
import { AUTHENTICATE, GOOGLE_SIGNUP, REFRESH_TOKEN, SEND_SMS_OTP, VERIFY_SMS_OTP } from '../controllers/events';

const router = express.Router();

router.post('/send-sms-otp', eventHandler(SEND_SMS_OTP));

router.post('/verify-sms-otp', eventHandler(VERIFY_SMS_OTP));

router.post('/google-auth', eventHandler(GOOGLE_SIGNUP))

router.get('/refresh-token', eventHandler(REFRESH_TOKEN));

router.get('/authenticate', eventHandler(AUTHENTICATE));


const accountRouter = router;
export default accountRouter;