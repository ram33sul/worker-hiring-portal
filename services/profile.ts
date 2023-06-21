import mongoose from "mongoose"
import { validateAge, validateBio, validateEmail, validateGender, validateName } from "../validation/inputs"
import { validateBoolean, validatePositiveNumber, validateString, validateStringArray } from "../validation/types"
import User from "../model/userSchema";
import { validate } from "../validation/general";
import { uploadToCloudinary } from "./cloudinary";

interface EditProfileService {
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    profilePicture: unknown,
    isWorker: boolean,
    userId: string | mongoose.Types.ObjectId;
}
export const editProfileService = ({
    firstName,
    lastName,
    gender,
    email,
    profilePicture,
    isWorker,
    userId
}: EditProfileService) => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validate([
                [ 'firstName', validateString, firstName ],
                [ 'lastname', validateString, lastName ],
                [ 'gender', validateGender, gender ],
                [ 'profilePicture', validateString, profilePicture ],
                [ 'isWorker', validateBoolean, isWorker ],
                [ 'email', validateEmail, email]
            ]);
            if(errors.length){
                return reject({errors, status: 400, error: new Error("invalid inputs!")});
            }
            let profilePicUrl = ''
            if(profilePicture){
                await uploadToCloudinary(`profilePictures/${userId}.png`).then((result: any) => {
                    profilePicUrl = result.url;
                }).catch((error) => {
                    reject([{message: "Can't be uploaded to cloudinary!"}]);
                    return;
                });
            }
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{ 
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    profilePicture: profilePicUrl,
                    isWorker: isWorker,
                    email: email
                }
            }).then(() => {
                return User.findOne({_id: userId})
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

interface RegisterAsWorkerServiceData {
    bio: string, 
    age: number,
    categoryList: {
        id: string | mongoose.Types.ObjectId,
        hourlyWage: number,
        dailyWage: number
    }[],
    userId: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    openToWork: boolean,
    primaryCategory: string,
    profilePicture: unknown
}

interface RegisterAsWorkerService {
    data: RegisterAsWorkerServiceData,
    profilePicture: unknown
}

export const registerAsWorkerService = ({ data, profilePicture }: RegisterAsWorkerService) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { bio, age, categoryList, userId, firstName, lastName, email, gender, openToWork, primaryCategory } = data
            if(!(validateBio(bio) && validateAge(age) && validateName(firstName) && validateName(lastName) && validateEmail(email) && (gender === undefined || validateGender(gender)) && (openToWork === undefined || validateBoolean(openToWork)))){
                return reject({status: 400, error: "invalid inputs!"});
            }
            if(!Array.isArray(categoryList)){
                return reject({status: 400, error: "category list must be an array!"});
            }
            const isPrimaryCategory = categoryList.filter((elem) => elem.id === primaryCategory);
            if(primaryCategory && isPrimaryCategory.length !== 1){
                return reject({status: 400, error: "Primary skill must be only one and should be included in the category list!"})
            }
            let profilePicUrl = ''
            if(profilePicture){
                await uploadToCloudinary(`profilePictures/${userId}.png`).then((result: any) => {
                    profilePicUrl = result.url;
                }).catch((error) => {
                    reject([{message: "Can't be uploaded to cloudinary!"}]);
                    return;
                });
            }
            categoryList = categoryList.map((elem) => ({...elem, id: new mongoose.Types.ObjectId(elem.id)}))
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{
                $set: {
                    bio,
                    age,
                    categoryList,
                    firstName,
                    lastName,
                    email,
                    gender,
                    openToWork,
                    isWorker: true,
                    primaryCategory: new mongoose.Types.ObjectId(primaryCategory),
                    profilePicture: profilePicUrl
                }
            }).then(() => {
                return User.findOne({_id: userId})
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const openToWorkOnService = ({userId}: {userId: mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{
                $set: {
                    openToWork: true
                }
            }).then(() => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

export const openToWorkOffService = ({userId}: {userId: mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{
                $set: {
                    openToWork: false
                }
            }).then(() => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

export const getUserDetailsService = ({id}: {id: mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            id = new mongoose.Types.ObjectId(id);
            User.aggregate([
                {
                    $match: {
                        _id: id
                    }
                },{
                    $lookup: {
                        from: "workers",
                        localField: "categoryList.id",
                        foreignField: "_id",
                        as: "categoryListDetails"
                    }
                }
            ]).then((response) => {
                for(let i = 0; i < response[0].categoryList.length; i++){
                    for(let j = 0; j < response[0].categoryListDetails.length; j++){
                        if(JSON.stringify(response[0].categoryList[i].id) === JSON.stringify(response[0].categoryListDetails[j]._id)){
                            response[0].categoryList[i] = { ...response[0].categoryList[i], ...response[0].categoryListDetails[j]};
                        }
                    }
                }
                resolve({data: response[0]})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

