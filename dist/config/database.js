"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connect = () => {
    const URI = process.env.MONGOOSE_URI;
    mongoose_1.default.connect(URI).then(() => {
        console.log(`Database connected: ${URI}`);
    });
};
exports.default = { connect };
