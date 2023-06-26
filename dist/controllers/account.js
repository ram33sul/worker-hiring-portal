"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.eventHandler = void 0;
const account_1 = require("../services/account");
const events_1 = require("./events");
const profile_1 = require("../services/profile");
const worker_1 = require("../services/worker");
const banner_1 = require("../services/banner");
const address_1 = require("../services/address");
const rating_1 = require("../services/rating");
const favourites_1 = require("../services/favourites");
const sampleWorks_1 = require("../services/sampleWorks");
const eventHandler = (action) => {
    return (req, res) => {
        try {
            console.log(`Requested service: ${action}`);
            const event = (0, exports.events)(action);
            req.headers.token = req.headers.authorization;
            event(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), req.query), { file: req.file, files: req.files }), req.headers), { userId: req.verifiedUserId })).then((response) => {
                const { data, headers } = response;
                res.header(headers);
                res.send({
                    status: true,
                    data
                });
                console.log(`Response sent: ${action}`);
            }).catch(({ error, status, errors }) => {
                status !== null && status !== void 0 ? status : (status = 500);
                if (errors) {
                    return res.status(status).send({ error, errors });
                }
                res.status(status).send({ error });
                console.log(`Error occured: ${action} - ${error}`);
            });
        }
        catch (error) {
            res.status(500).send({ error: new Error("Internal error occured!") });
            console.log(`Internal error: ${action} - ${error}`);
        }
    };
};
exports.eventHandler = eventHandler;
const events = (action) => {
    switch (action) {
        case events_1.SEND_SMS_OTP:
            return account_1.sendSmsOtpService;
        case events_1.VERIFY_SMS_OTP:
            return account_1.verifySmsOtpService;
        case events_1.REFRESH_TOKEN:
            return account_1.refreshTokenService;
        case events_1.VERIFY_USER:
            return account_1.verifyUserService;
        case events_1.EDIT_PROFILE:
            return profile_1.editProfileService;
        case events_1.REGISTER_AS_WORKER:
            return profile_1.registerAsWorkerService;
        case events_1.OPEN_TO_WORK_ON:
            return profile_1.openToWorkOnService;
        case events_1.OPEN_TO_WORK_OFF:
            return profile_1.openToWorkOffService;
        case events_1.AUTHENTICATE:
            return account_1.authenticateService;
        case events_1.GET_WORKER_CATEGORIES:
            return worker_1.getWorkerCategoriesService;
        case events_1.ADD_WORKER_CATEGORY:
            return worker_1.addWorkerCategoryService;
        case events_1.GET_USER_DETAILS:
            return profile_1.getUserDetailsService;
        case events_1.ADD_BANNER:
            return banner_1.addBannerService;
        case events_1.GET_BANNERS:
            return banner_1.getBannersService;
        case events_1.GET_SUGGESTED_CATEGORIES:
            return worker_1.getSuggestedCategoriesService;
        case events_1.CATEGORY_SEARCH:
            return worker_1.getCategorySearchService;
        case events_1.ADD_ADDRESS:
            return address_1.addAddressService;
        case events_1.GET_ALL_ADDRESSES:
            return address_1.getAllAddressesService;
        case events_1.GET_ADDRESS:
            return address_1.getAddressService;
        case events_1.ADD_RATING:
            return rating_1.AddRatingService;
        case events_1.GET_RATINGS:
            return rating_1.getRatingsService;
        case events_1.ADD_TO_FAVOURITES:
            return favourites_1.addToFavouritesService;
        case events_1.GET_FAVOURITES:
            return favourites_1.getFavouritesService;
        case events_1.REMOVE_FROM_FAVOURITES:
            return favourites_1.removeFavouritesService;
        case events_1.SET_SELECTED_ADDRESS:
            return address_1.setSelectedAddressService;
        case events_1.ADD_SAMPLE_WORK:
            return sampleWorks_1.addSampleWorkService;
        case events_1.GET_SAMPLE_WORKS:
            return sampleWorks_1.getSampleWorksService;
        case events_1.GET_SAMPLE_WORK:
            return sampleWorks_1.getSampleWorkService;
        case events_1.DELETE_SAMPLE_WORK:
            return sampleWorks_1.deleteSampleWorkService;
        default:
            return () => Promise.reject("Internal error occured!");
    }
};
exports.events = events;
