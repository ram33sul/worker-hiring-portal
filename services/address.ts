import mongoose from "mongoose"
import Address from "../model/addressSchema"

interface AddAddressService {
    title: string,
    houseName: string,
    place: string,
    subLocality: string,
    city: string,
    state: string,
    country: string,
    pin: number,
    location: number[],
    userId: string | mongoose.Types.ObjectId
}
export const addAddressService = ({title, houseName, place, subLocality, city, state, country, pin, location, userId}: AddAddressService) => {
    return new Promise((resolve, reject) => {
        try {

            Address.create({
                userId: new mongoose.Types.ObjectId(userId),
                title,
                houseName,
                place,
                subLocality,
                city,
                state,
                country,
                pin,
                location
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error){
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

export const getAllAddressesService = ({userId}: {userId: string | mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            Address.find({
                userId: new mongoose.Types.ObjectId(userId),
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error){
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

export const getAddressService = ({id}: {id: string}) => {
    return new Promise((resolve, reject) => {
        try {
            Address.find({
                _id: new mongoose.Types.ObjectId(id),
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error){
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}