"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const account_1 = require("../services/account");
const auth = (req, res, next) => {
    var _a, _b;
    const token = (_b = (_a = req.headers["authorization"]) !== null && _a !== void 0 ? _a : req.body["authorization"]) !== null && _b !== void 0 ? _b : req.query["authorization"];
    (0, account_1.verifyUserService)({ token: token }).then((response) => {
        req.verifiedUserId = response.data;
        next();
    }).catch((error) => {
        res.status(error === null || error === void 0 ? void 0 : error.status).send({
            status: false,
            error
        });
    });
};
exports.auth = auth;
