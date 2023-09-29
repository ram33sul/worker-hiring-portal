import mongoose from "mongoose";

export interface Keyable {
    [key: string]: (params: any) => Promise<unknown>
}

export interface PaginationRequest {
    page: number,
    pageSize: number
}