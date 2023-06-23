import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

export const uploadToCloudinary = async (localFilePath: any) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET     
      });
    const mainFolderName = "main";
    const filePathOnCloudinary = mainFolderName + '/' + localFilePath;
    return cloudinary.uploader.upload(localFilePath,{"public_id": filePathOnCloudinary})
    .then((result) => {
        fs.unlinkSync(localFilePath);
        return ({
            url: result.url
        })
    }).catch((error) => {
        fs.unlinkSync(localFilePath);
        return ({
            message: "Can't be uploaded to cloudinary!"
        })
    })
}

export const deleteFromCloudinary = async (filePath: string) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET      
      });
    return cloudinary.uploader.destroy(`main/${filePath}`)
    .then((result) => {
        return true;
    }).catch((error) => {
        return false;
    })
}