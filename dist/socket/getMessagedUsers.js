"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const broadcast_1 = require("./broadcast");
const messageSchema_1 = __importDefault(require("../model/messageSchema"));
const onMessage = (userId, clients) => {
    return (message) => __awaiter(void 0, void 0, void 0, function* () {
        const messages = JSON.parse(message);
        const messageData = yield messageSchema_1.default.aggregate([
            {
                $match: {
                    $or: [
                        {
                            from: new mongoose_1.default.Types.ObjectId(userId)
                        }, {
                            to: new mongoose_1.default.Types.ObjectId(userId)
                        }
                    ]
                }
            }
        ]);
        (0, broadcast_1.broadcast)({ data: messageData, from: null, to: messages.to, clients: clients, event: 'message' });
    });
};
exports.onMessage = onMessage;
