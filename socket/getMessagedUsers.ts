import mongoose from "mongoose"
import { MessageI } from "../interfaces/message"
import { broadcast } from "./broadcast"
import Message from "../model/messageSchema"

export const onMessage = (userId: string, clients: any) => {
    return async (message: string) => {
        const messages: MessageI = JSON.parse(message)
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
            }
        ])

        broadcast({data: messageData, from: null, to: messages.to, clients: clients, event: 'message'})
    }
}