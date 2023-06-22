import { authenticateService, refreshTokenService, sendSmsOtpService, verifySmsOtpService, verifyUserService } from "../services/account"
import { Request, Response } from "express";
import { ADD_ADDRESS, ADD_BANNER, ADD_RATING, ADD_TO_FAVOURITES, ADD_WORKER_CATEGORY, AUTHENTICATE, CATEGORY_SEARCH, EDIT_PROFILE, GET_ADDRESS, GET_ALL_ADDRESSES, GET_BANNERS, GET_FAVOURITES, GET_RATINGS, GET_SUGGESTED_CATEGORIES, GET_USER_DETAILS, GET_WORKER_CATEGORIES, OPEN_TO_WORK_OFF, OPEN_TO_WORK_ON, REFRESH_TOKEN, REGISTER_AS_WORKER, REMOVE_FROM_FAVOURITES, SEND_SMS_OTP, SET_SELECTED_ADDRESS, VERIFY_SMS_OTP, VERIFY_USER } from "./events";
import { editProfileService, getUserDetailsService, openToWorkOffService, openToWorkOnService, registerAsWorkerService } from "../services/profile";
import { addWorkerCategoryService, getCategorySearchService, getSuggestedCategoriesService, getWorkerCategoriesService } from "../services/worker";
import { addBannerService, getBannersService } from "../services/banner";
import { addAddressService, getAddressService, getAllAddressesService, setSelectedAddressService } from "../services/address";
import { AddRatingService, getRatingsService } from "../services/rating";
import { addToFavouritesService, getFavouritesService, removeFavouritesService } from "../services/favourites";

export const eventHandler = (action: string) => {
    return (req: any, res: Response) => {
        try {
            const event = events(action);
            req.headers.token = req.headers.authorization;
            event({...req.body, ...req.query, file: req.file, ...req.headers, userId: req.verifiedUserId}).then((response) => {
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
        case GET_SUGGESTED_CATEGORIES:
            return getSuggestedCategoriesService;
        case CATEGORY_SEARCH:
            return getCategorySearchService;
        case ADD_ADDRESS:
            return addAddressService;
        case GET_ALL_ADDRESSES:
            return getAllAddressesService;
        case GET_ADDRESS:
            return getAddressService;
        case ADD_RATING:
            return AddRatingService;
        case GET_RATINGS:
            return getRatingsService;
        case ADD_TO_FAVOURITES:
            return addToFavouritesService;
        case GET_FAVOURITES:
            return getFavouritesService;
        case REMOVE_FROM_FAVOURITES:
            return removeFavouritesService;
        case SET_SELECTED_ADDRESS:
            return setSelectedAddressService;
        default:
            return () => Promise.reject("Internal error occured!")
    }
}
