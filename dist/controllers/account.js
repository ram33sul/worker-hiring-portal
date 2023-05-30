"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsOtp = void 0;
const account_1 = require("../services/account");
const sendSmsOtp = (req, res) => {
    try {
        (0, account_1.sendSmsOtpService)(req.body).then((response) => {
            res.send({
                status: true,
                data: response
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
            message: "Internal error occured"
        });
    }
};
exports.sendSmsOtp = sendSmsOtp;
