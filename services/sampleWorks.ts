import mongoose from "mongoose"
import SampleWorks from "../model/sampleWorksSchema"
import { deleteFromCloudinary, uploadToCloudinary } from "./cloudinary"

interface AddSampleWorkServiceData {
    title: string,
    description: string,
}

interface AddSampleWorkService {
    data: AddSampleWorkServiceData,
    userId: string,
    file: unknown
}
export const addSampleWorkService = ({data, userId, file}:  AddSampleWorkService) => {
    return new Promise(async (resolve, reject) => {
        try {
            let imageUrl = ''
            const image = file;
            if(image){
                await uploadToCloudinary(`sampleWorks/${userId}.png`).then((result: any) => {
                    imageUrl = result.url;
                }).catch((error) => {
                    reject([{error: "Can't be uploaded to cloudinary!", status: 400}]);
                    return;
                });
            }
            SampleWorks.create({
                ...data,
                imageUrl,
                userId: new mongoose.Types.ObjectId(userId),
                timestamp: new Date()
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

export const getSampleWorksService = ({id, page, pageSize}: {id: string; page: number; pageSize: number}) => {
    return new Promise((resolve, reject) => {
        try {
            SampleWorks.find({
                userId: new mongoose.Types.ObjectId(id)
            }).skip(page * pageSize).limit(pageSize).then((response: any) => {
                response = response?.map?.((res: any) => ({...res, timestamp: res?.timestamp?.getTime?.()}))
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const getSampleWorkService = ({id}: {id: string}) => {
    return new Promise((resolve, reject) => {
        try {
            SampleWorks.findOne({
                _id: new mongoose.Types.ObjectId(id)
            }).then((response: any) => {
                response.timestamp = response?.timestamp?.getTime?.();
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const deleteSampleWorkService = ({id, userId}: {id: string, userId: string}) => {
    return new Promise((resolve, reject) => {
        try {
            SampleWorks.deleteOne({
                _id: new mongoose.Types.ObjectId(id)
            }).then((response) => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}