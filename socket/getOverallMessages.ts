import mongoose from "mongoose";
import { MessageI } from "../interfaces/message";
import Message from "../model/messageSchema";
import { broadcast } from "./broadcast";

export const getOverallMessages = (userId: string, clients: any) => {
    return async (message: string) => {
        const messages: MessageI = JSON.parse(message)
        console.log(messages)
        const messageData = await Message.aggregate([
            {
                $match: {
                    $or: [
                        {
                            from: new mongoose.Types.ObjectId(userId)
                        },{
                            to: new mongoose.Types.ObjectId(userId)
                        }
                    ]
                }
            },{
                $sort: {
                    sendAt: -1
                }
            }
        ])

        broadcast({data: messageData, from: null, to: messages.to, clients: clients, event: 'overall-messages'})
    }
}