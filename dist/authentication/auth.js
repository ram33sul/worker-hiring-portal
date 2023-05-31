"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const account_1 = require("../services/account");
const auth = (req, res, next) => {
    var _a, _b;
    const token = (_b = (_a = req.headers["access-token"]) !== null && _a !== void 0 ? _a : req.body["access-token"]) !== null && _b !== void 0 ? _b : req.query["access-token"];
    (0, account_1.verifyUserService)({ token: token }).then((response) => {
        req.verifiedUserId = response;
        next();
    }).catch((error) => {
        res.send({
            status: false,
            message: error
        });
    });
};
exports.auth = auth;
