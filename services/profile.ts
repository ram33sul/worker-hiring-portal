import mongoose, { mongo } from "mongoose"
import { validateAge, validateBio, validateGender, validateName } from "../validation/inputs"
import { validateBoolean, validatePositiveNumber, validateString, validateStringArray } from "../validation/types"
import User from "../model/userSchema";
import { validate } from "../validation/general";

interface EditProfileService {
    firstName: string,
    lastName: string,
    gender: string,
    profilePicture: string,
    isWorker: boolean,
    userId: string | mongoose.Types.ObjectId;
}
export const editProfileService = ({
    firstName,
    lastName,
    gender,
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
                [ 'isWorker', validateBoolean, isWorker ]
            ]);
            if(errors.length){
                return reject(errors);
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
                    isWorker: isWorker
                }
            }).then(() => {
                return User.findOne({_id: userId})
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject("Database error occured!")
            })
        } catch (error) {
            reject("Internal error occured!")
        }
    })
}

interface RegisterAsWorkerService {
    bio: string, 
    age: number,
    skillsList: string[],
    sampleWorkImages: string[],
    dailyWage: number,
    hourlyWage: number,
    primarySkill: string,
    userId: mongoose.Types.ObjectId
}

export const registerAsWorkerService = ({bio, age, skillsList, sampleWorkImages, dailyWage, hourlyWage, primarySkill, userId}: RegisterAsWorkerService) => {
    return new Promise((resolve, reject) => {
        try {
            if(!(validateBio(bio) && validateAge(age) && validateStringArray(skillsList) && validateStringArray(sampleWorkImages) && validatePositiveNumber(dailyWage) && validatePositiveNumber(hourlyWage) && validateString(primarySkill))){
                return reject("Validation failed!")
            }
            userId = new mongoose.Types.ObjectId(userId);
            const primarySkillObject = new mongoose.Types.ObjectId(primarySkill);
            User.updateOne({
                _id: userId
            },{
                $set: {
                    bio,
                    age,
                    skillsList,
                    sampleWorkImages,
                    dailyWage,
                    hourlyWage,
                    primarySkill: primarySkillObject
                }
            }).then(() => {
                return User.findOne({_id: userId})
            }).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                console.log(error)
                reject("Database error occured!")
            })
        } catch (error) {
            reject("Internal error occured!")
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
                reject("Database error occured!")
            })
        } catch (error) {
            reject("Internal error occured!")
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
                reject("Database error occured!")
            })
        } catch (error) {
            reject("Internal error occured!")
        }
    })
}