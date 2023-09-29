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
exports.getChatList = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema_1 = __importDefault(require("../model/messageSchema"));
const broadcast_1 = require("./broadcast");
const getChatList = (userId, clients) => {
    return (message) => __awaiter(void 0, void 0, void 0, function* () {
        const messages = JSON.parse(message);
        const { page, pageSize } = messages;
        const data = yield messageSchema_1.default.aggregate([
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
            }, {
                $project: {
                    chatUser: {
                        $cond: [
                            {
                                from: new mongoose_1.default.Types.ObjectId(userId)
                            },
                            "$to",
                            "$from"
                        ]
                    },
                    to: 1,
                    from: 1,
                    type: 1,
                    content: 1,
                    sendAt: 1
                }
            }, {
                $sort: {
                    sendAt: -1
                }
            }, {
                $group: {
                    _id: "$chatUser",
                    to: {
                        $first: "$to"
                    },
                    from: {
                        $first: "$from"
                    },
                    type: {
                        $first: "$type"
                    },
                    content: {
                        $first: "$content"
                    },
                    sendAt: {
                        $first: "$sendAt"
                    }
                }
            }, {
                $sort: {
                    sendAt: -1
                }
            }, {
                $skip: page * pageSize
            }, {
                $limit: pageSize
            }, {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            }, {
                $project: {
                    chatUser: "$_id",
                    from: "$from",
                    to: "$to",
                    type: "$type",
                    content: "$content",
                    sendAt: {
                        $toLong: "$sendAt"
                    },
                    profilePicture: {
                        $arrayElemAt: [
                            "$userDetails.profilePicture",
                            0
                        ]
                    },
                    firstName: {
                        $arrayElemAt: [
                            "$userDetails.firstName",
                            0
                        ]
                    },
                    lastName: {
                        $arrayElemAt: [
                            "$userDetails.lastName",
                            0
                        ]
                    },
                }
            }
        ]);
        (0, broadcast_1.broadcast)({ data: data, from: null, to: userId, clients: clients, event: 'chat-list' });
    });
};
exports.getChatList = getChatList;
