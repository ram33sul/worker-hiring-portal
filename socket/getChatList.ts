import mongoose from "mongoose";
import { PaginationRequest } from "../interfaces/interface";
import { MessageI } from "../interfaces/message"
import Message from "../model/messageSchema";

export const getChatList = (userId: string, clients: any) => {
    return async (message: any) => {
        const messages: PaginationRequest = JSON.parse(message);
        const { page, pageSize } = messages;

        const data = await Message.aggregate([
            {
                $match: {
                    $or:[
                        {
                            from: new mongoose.Types.ObjectId(userId)
                        },{
                            to: new mongoose.Types.ObjectId(userId)
                        }
                    ]
                }
            },{
                $project: {
                    chatUser: {
                        $cond: [
                            {
                                from: new mongoose.Types.ObjectId(userId)
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
            },{
                $sort: {
                    sendAt: -1
                }
            },{
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
            },{
                $sort: {
                    sendAt: -1
                }
            },{
                $skip: page * pageSize
            },{
                $limit: pageSize
            },{
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },{
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
        ])

        console.log(data)
    }
}