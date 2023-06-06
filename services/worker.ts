import Worker from "../model/workerCategorySchema";
import { validate } from "../validation/general";
import { validateNumber, validateString } from "../validation/types";

interface AddWorkerCategoryService{
    title: string, 
    minimumWage: number, 
    imageUrl?: string,
    skill: string
}
export const addWorkerCategoryService = ({title, minimumWage, skill}: AddWorkerCategoryService) => {
    return new Promise((resolve, reject) => {
        try {
            let errors = [];
            if(title === undefined){
                errors[errors.length] = 'title is required!'
            }
            if(skill === undefined){
                errors[errors.length] = 'skill is required!'
            }
            if(errors.length){
                return reject({status: 400, error: new Error("Inputs are required!"), errors})
            }
            errors = validate([
                ['title', validateString, title],
                ['minimumWage', validateNumber, minimumWage],
                ['skill', validateString, skill]
            ])
            if(errors.length){
                return reject({status: 400, error: new Error("Inputs are invalid!"), errors})
            }
            Worker.create({
                title: title,
                minimumWage: minimumWage,
                skill: skill
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


export const getWorkerCategoriesService = () => {
    return new Promise((resolve, reject) => {
        try {
            Worker.find().then((response) => {
                resolve({data: response});
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}