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
    categoryList: {
        id: string,
        hourlyWage: number,
        weeklyWage: number
    }[],
    userId: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    email: string,
    gender: boolean,
    openToWork: boolean,
    primarySkill: string
}
export const registerAsWorkerService = ({bio, age, categoryList, userId, firstName, lastName, email, gender, openToWork, primarySkill}: RegisterAsWorkerService) => {
    return new Promise((resolve, reject) => {
        try {
            if(!(validateBio(bio) && validateAge(age) && validateName(firstName) && validateName(lastName) && validateEmail(email) && validateBoolean(gender) && validateBoolean(openToWork))){
                return reject({status: 400, error: new Error("invalid inputs!")});
            }
            userId = new mongoose.Types.ObjectId(userId);
            if(!Array.isArray(categoryList)){
                return reject({status: 400, error: new Error("category list must be an array!")});
            }
            const isPrimarySkill = categoryList.filter((elem) => elem.id === primarySkill);
            if(primarySkill && isPrimarySkill.length !== 1){
                return reject({status: 400, error: new Error("Primary skill must be only one and should be included in the category list!")})
            }
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
                    primarySkill: new mongoose.Types.ObjectId(primarySkill)
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