import { authenticateService, refreshTokenService, sendSmsOtpService, verifySmsOtpService, verifyUserService } from "../services/account"
import { Request, Response } from "express";
import { ADD_BANNER, ADD_WORKER_CATEGORY, AUTHENTICATE, EDIT_PROFILE, GET_BANNERS, GET_USER_DETAILS, GET_WORKER_CATEGORIES, OPEN_TO_WORK_OFF, OPEN_TO_WORK_ON, REFRESH_TOKEN, REGISTER_AS_WORKER, SEND_SMS_OTP, VERIFY_SMS_OTP, VERIFY_USER } from "./events";
import { editProfileService, getUserDetailsService, openToWorkOffService, openToWorkOnService, registerAsWorkerService } from "../services/profile";
import { addWorkerCategoryService, getWorkerCategoriesService } from "../services/worker";
import { addBannerService, getBannersService } from "../services/banner";

export const eventHandler = (action: string) => {
    return (req: any, res: Response) => {
        try {
            const event = events(action);
            req.headers.token = req.headers.authorization;
            event({...req.body, ...req.query, ...req.headers, userId: req.verifiedUserId}).then((response) => {
                const { data, headers} = response as {data: unknown, headers: unknown};
                res.header(headers);
                res.send({
                    status: true,
                    data
                })
            }).catch(({error, status, errors}) => {
                if(errors){
                    return res.status(status).send({error, errors})
                }
                res.status(status).send({error})
            })
        } catch (error) {
            res.status(500).send({error: new Error("Internal error occured!")})
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
            return verifyUserService;
        case EDIT_PROFILE:
            return editProfileService;
        case REGISTER_AS_WORKER:
            return registerAsWorkerService;
        case OPEN_TO_WORK_ON: 
            return openToWorkOnService;
        case OPEN_TO_WORK_OFF:
            return openToWorkOffService;
        case AUTHENTICATE:
            return authenticateService;
        case GET_WORKER_CATEGORIES:
            return getWorkerCategoriesService;
        case ADD_WORKER_CATEGORY:
            return addWorkerCategoryService;
        case GET_USER_DETAILS:
            return getUserDetailsService;
        case ADD_BANNER:
            return addBannerService;
        case GET_BANNERS:
            return getBannersService;
        default:
            return () => Promise.reject("Internal error occured!")
    }
}
