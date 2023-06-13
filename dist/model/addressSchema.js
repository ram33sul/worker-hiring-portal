"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const addressSchema = new mongoose_1.default.Schema({
    title: { type: String, default: '' },
    completeAddress: { type: String, default: '' },
    floor: { type: String, default: '' },
    landmark: { type: String, default: '' },
    place: { type: String, default: '' },
    subLocality: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    pin: { type: Number, default: '' },
    location: { type: Array, default: [0, 0] }
});
const Address = mongoose_1.default.model("address", addressSchema);
exports.default = Address;
