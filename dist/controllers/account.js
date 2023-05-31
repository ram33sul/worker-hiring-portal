"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.eventHandler = void 0;
const account_1 = require("../services/account");
const events_1 = require("./events");
const eventHandler = (action) => {
    return (req, res) => {
        try {
            const event = (0, exports.events)(action);
            event(Object.assign(Object.assign(Object.assign({}, req.body), req.query), req.headers)).then((response) => {
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
        default:
            return () => Promise.reject("Internal error occured!");
    }
};
exports.events = events;
