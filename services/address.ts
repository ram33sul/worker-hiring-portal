import mongoose from "mongoose"
import Address from "../model/addressSchema"
import User from "../model/userSchema"

interface AddAddressService {
    title: string,
    completeAddress: string,
    floor: string,
    landmark: string,
    place: string,
    subLocality: string,
    city: string,
    state: string,
    country: string,
    pin: number,
    location: number[],
    userId: string | mongoose.Types.ObjectId
}
export const addAddressService = ({title, completeAddress, floor, landmark, place, subLocality, city, state, country, pin, location, userId}: AddAddressService) => {
    return new Promise((resolve, reject) => {
        try {
            Address.create({
                userId: new mongoose.Types.ObjectId(userId),
                title,
                completeAddress,
                floor,
                landmark,
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
            Address.findOne({
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

export const setSelectedAddressService = ({addressId, userId}: { addressId: string, userId: string }) => {
    return new Promise((resolve, reject) => {
        try {
            Address.findOne({
                _id: new mongoose.Types.ObjectId(addressId),
            }).then((response) => {
                const addressData = response;
                if(!response){
                    return reject({status: 404, error: "Address matching the addressId cannot be found!"})
                }
                User.updateOne({
                    _id: new mongoose.Types.ObjectId(userId)
                },{
                    $set: {
                        selectedAddress: new mongoose.Types.ObjectId(addressId)
                    }
                }).then((response) => {
                    resolve({data: addressData})
                }).catch((error) => {
                    reject({status: 502, error: new Error("Database error occured!")})
                })
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error){
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}