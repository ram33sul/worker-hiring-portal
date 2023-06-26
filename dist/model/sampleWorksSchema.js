"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sampleWorksSchema = new mongoose_1.default.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    timestamp: { type: Date, default: new Date() },
    userId: { type: mongoose_1.default.Types.ObjectId, require: true },
    imageUrl: { type: String, default: '' }
});
const SampleWorks = mongoose_1.default.model("sample-works", sampleWorksSchema);
exports.default = SampleWorks;
