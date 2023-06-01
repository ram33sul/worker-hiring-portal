import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: ''},
    lastName: { type: String, default: ''},
    phone: { type: String, require: true},
    countryCode: { type: String, require: true},
    status: { type: Boolean, default: true},
    isWorker: { type: Boolean, default: false},
    gender: { type: String, default: ''},
    profilePicture: { type: String, default: ''},
    bio: { type: String, default: ''},
    age: { type: Number, default: 0},
    categoryList: { type: Array, default: []},
    sampleWorkImages: { type: Array, default: []},
    dailyWage: { type: Number, default: 0},
    hourlyWage: { type: Number, default: 0},
    primaryCategory: { type: mongoose.Types.ObjectId, default: null},
    openToWork: { type: Boolean, default: false}
})

const User = mongoose.model("user", userSchema);

export default User;