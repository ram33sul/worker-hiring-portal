import mongoose from "mongoose";
import { MessageI } from "../interfaces/message";
import Message from "../model/messageSchema";
import { broadcast } from "./broadcast";

export const onMessage = (userId: string, clients: any) => {
    return async (message: string) => {
        const messages: MessageI = JSON.parse(message)
        const messageData = await Message.create({
            from: new mongoose.Types.ObjectId(userId),
            to: new mongoose.Types.ObjectId(messages.to),
            type: messages.type,
            content: messages.content,
            sendAt: new Date()
        })
        broadcast({data: messageData, from: null, to: messages.to, clients: clients, event: 'message'})
    }
}