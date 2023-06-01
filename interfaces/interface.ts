import mongoose from "mongoose";

export interface Keyable {
    [key: string]: (params: any) => Promise<unknown>
}