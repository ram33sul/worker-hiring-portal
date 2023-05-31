import { refreshTokenService, sendSmsOtpService, verifySmsOtpService, verifyUserService } from "../services/account"
import { Request, Response } from "express";
import { REFRESH_TOKEN, SEND_SMS_OTP, VERIFY_SMS_OTP, VERIFY_USER } from "./events";

export const eventHandler = (action: string) => {
    return (req: Request, res: Response) => {
        try {
            const event = events(action);
            event({...req.body, ...req.query, ...req.headers}).then((response) => {
                const { data, headers} = response as {data: unknown, headers: unknown};
                res.header(headers);
                res.send({
                    status: true,
                    data
                })
            }).catch((error: string) => {
                res.send({
                    status: false,
                    message: error
                })
            })
        } catch (error) {
            res.send({
                status: false,
                message: "Internal error occured!"
            })
        }
    }
}

export const events = (action: string) => {
    switch(action){
        case SEND_SMS_OTP:
            return sendSmsOtpService;
        case VERIFY_SMS_OTP:
            return verifySmsOtpService;
        case REFRESH_TOKEN:
            return refreshTokenService;
        case VERIFY_USER:
            return verifyUserService
        default:
            return () => Promise.reject("Internal error occured!")
    }
}
