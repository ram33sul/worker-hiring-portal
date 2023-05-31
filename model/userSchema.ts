import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fname: { type: String, default: ''},
    lname: { type: String, default: ''},
    mobile: { type: String, require: true},
    countryCode: { type: String, require: true},
    status: { type: Boolean, default: true},
    isWorker: { type: Boolean, default: false}
})

const User = mongoose.model("user", userSchema);

export default User;