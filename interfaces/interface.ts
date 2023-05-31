import mongoose from "mongoose";

export interface UserSchema extends mongoose.Document {
    fname: string,
    lname: string,
    mobile: string,
    countryCode: string,
    status: boolean,
    isWorker: boolean
}

export interface Keyable {
    [key: string]: (params: any) => Promise<unknown>
}