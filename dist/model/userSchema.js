"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fname: { type: String, default: '' },
    lname: { type: String, default: '' },
    mobile: { type: String, require: true },
    countryCode: { type: String, require: true },
    status: { type: Boolean, default: true },
    isWorker: { type: Boolean, default: false }
});
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
