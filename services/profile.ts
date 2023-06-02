import mongoose, { mongo } from "mongoose"
import { validateAge, validateBio, validateEmail, validateGender, validateName } from "../validation/inputs"
import { validateBoolean, validatePositiveNumber, validateString, validateStringArray } from "../validation/types"
import User from "../model/userSchema";
import { validate } from "../validation/general";

interface EditProfileService {
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    profilePicture: string,
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
    return new Promise((resolve, reject) => {
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
            userId = new mongoose.Types.ObjectId(userId);
            User.updateOne({
                _id: userId
            },{ 
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    profilePicture: profilePicture,
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

interface RegisterAsWorkerService {
    bio: string, 
    age: number,
    categoryList: string[],
    sampleWorkImages: string[],
    dailyWage: number,
    hourlyWage: number,
    primaryCategory: string,
    userId: mongoose.Types.ObjectId
}

export const registerAsWorkerService = ({bio, age, categoryList, sampleWorkImages, dailyWage, hourlyWage, primaryCategory, userId}: RegisterAsWorkerService) => {
    return new Promise((resolve, reject) => {
        try {
            if(!(validateBio(bio) && validateAge(age) && validateStringArray(categoryList) && validateStringArray(sampleWorkImages) && validatePositiveNumber(dailyWage) && validatePositiveNumber(hourlyWage) && validateString(primaryCategory))){
                return reject({status: 400, error: new Error("invalid inputs!")})
            }
            userId = new mongoose.Types.ObjectId(userId);
            const primaryCategoryObject = new mongoose.Types.ObjectId(primaryCategory);
            User.updateOne({
                _id: userId
            },{
                $set: {
                    bio,
                    age,
                    categoryList,
                    sampleWorkImages,
                    dailyWage,
                    hourlyWage,
                    primaryCategory: primaryCategoryObject
                }
            }).then(() => {
                return User.findOne({_id: userId})
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                console.log(error)
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
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

export const userDetailsService = ({userId}: {userId: mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            User.findOne({_id: userId}).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}