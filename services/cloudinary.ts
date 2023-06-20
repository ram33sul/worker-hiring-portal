import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

export const uploadToCloudinary = async (localFilePath: any) => {
    cloudinary.config({
        cloud_name: "doazsqomm",
        api_key: "711717321567629",
        api_secret: "vhsVlza-eayvedmDMG6GOCL-qnk"      
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