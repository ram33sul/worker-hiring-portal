"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.eventHandler = void 0;
const account_1 = require("../services/account");
const events_1 = require("./events");
const profile_1 = require("../services/profile");
const eventHandler = (action) => {
    return (req, res) => {
        try {
            const event = (0, exports.events)(action);
            req.headers.token = req.headers.Authorization;
            event(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), req.query), req.headers), { userId: req.verifiedUserId })).then((response) => {
                const { data, headers } = response;
                res.header(headers);
                res.send({
                    status: true,
                    data
                });
            }).catch((error) => {
                res.send({
                    status: false,
                    message: error
                });
            });
        }
        catch (error) {
            res.send({
                status: false,
                message: "Internal error occured!"
            });
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
        default:
            return () => Promise.reject("Internal error occured!");
    }
};
exports.events = events;
