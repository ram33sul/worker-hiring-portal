import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from: {type: mongoose.Types.ObjectId, required: true},
    to: {type: mongoose.Types.ObjectId, required: true},
    type: {type: String, default: 'text'},
    content: {type: String, required: true},
    sendAt: {type: Date, required: true},
    status: {type: Boolean, default: true}
})

const Message = mongoose.model("messages", messageSchema);

export default Message;