"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = __importDefault(require("./account"));
const profile_1 = __importDefault(require("./profile"));
const worker_1 = __importDefault(require("./worker"));
const app = (0, express_1.default)();
app.use('/auth', account_1.default);
app.use('/profile', profile_1.default);
app.use('/worker', worker_1.default);
const apiRouter = app;
exports.default = apiRouter;
