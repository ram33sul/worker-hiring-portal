import express from 'express';
import { sendSmsOtp } from '../controllers/account';

const router = express.Router();

router.post('/send-sms-otp', sendSmsOtp);

export default router;