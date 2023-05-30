import { sendSmsOtpService } from "../services/account"
import { Request, Response } from "express";

export const sendSmsOtp = (req: Request, res: Response) => {
    try {
        sendSmsOtpService(req.body).then((response) => {
            res.send({
                status: true,
                data: response
            });
        }).catch((error) => {
            res.send({
                status: false,
                message: error
            })
        })
    } catch (error) {
        res.send({
            status: false,
            message: "Internal error occured"
        })
    }
}
