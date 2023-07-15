import mongoose from "mongoose";
import Favourites from "../model/favouritesSchema";

export const addToFavouritesService = ({addedUserId, userId}: {addedUserId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            if(!addedUserId){
                return reject({status: 400, error: "addedUserId is required!"})
            }
            userId = new mongoose.Types.ObjectId(userId);
            addedUserId = new mongoose.Types.ObjectId(addedUserId);
            Favourites.create({
                userId: userId,
                addedUserId: addedUserId
            }).then(() => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const removeFavouritesService = ({removedUserId}: {removedUserId: string | mongoose.Types.ObjectId }) => {
    return new Promise((resolve, reject) => {
        try {
            Favourites.deleteOne({
                addedUserId: new mongoose.Types.ObjectId(removedUserId)
            }).then((response) => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 500, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Interal error occured!"})
        }
    })
}

export const getFavouritesService = ({userId, page, pageSize}: {userId: string | mongoose.Types.ObjectId, page: number, pageSize: number}) => {
    return new Promise((resolve, reject) => {
        try {
            Favourites.find({
                userId: new mongoose.Types.ObjectId(userId)
            }).skip(page * pageSize).limit(pageSize).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 500, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Interal error occured!"})
        }
    })
}