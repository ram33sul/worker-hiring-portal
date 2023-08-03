"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    from: { type: mongoose_1.default.Types.ObjectId, required: true },
    to: { type: mongoose_1.default.Types.ObjectId, required: true },
    type: { type: String, default: 'text' },
    content: { type: String, required: true },
    sendAt: { type: Date, required: true },
    status: { type: Boolean, default: true }
});
const Message = mongoose_1.default.model("messages", messageSchema);
exports.default = Message;
