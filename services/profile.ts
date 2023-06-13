import mongoose from "mongoose"
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
    categoryList: {
        id: string,
        hourlyWage: number,
        dailyWage: number
    }[],
    userId: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    openToWork: boolean,
    primaryCategory: string
}
export const registerAsWorkerService = ({bio, age, categoryList, userId, firstName, lastName, email, gender, openToWork, primaryCategory}: RegisterAsWorkerService) => {
    return new Promise((resolve, reject) => {
        try {
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
                    primaryCategory: new mongoose.Types.ObjectId(primaryCategory)
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

export const getUserDetailsService = ({id}: {id: mongoose.Types.ObjectId}) => {
    return new Promise((resolve, reject) => {
        try {
            id = new mongoose.Types.ObjectId(id);
            User.findOne({_id: id}).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: new Error("Database error occured!")})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}
