import Proposal from "../model/proposalSchema";
import Worker from "../model/workerCategorySchema";
import { validate } from "../validation/general";
import { validateNumber, validateString } from "../validation/types";

interface AddWorkerCategoryService{
    title: string, 
    dailyMinWage: number,
    hourlyMinWage: number,
    imageUrl?: string,
    skill: string
}
export const addWorkerCategoryService = ({title, dailyMinWage, hourlyMinWage, skill}: AddWorkerCategoryService) => {
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
                ['minimumWage', validateNumber, dailyMinWage],
                ['minimumWage', validateNumber, hourlyMinWage],
                ['skill', validateString, skill]
            ])
            if(errors.length){
                return reject({status: 400, error: new Error("Inputs are invalid!"), errors})
            }
            Worker.create({
                title: title,
                dailyMinWage: dailyMinWage,
                hourlyMinWage: hourlyMinWage,
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

export const getWorkerCategoriesService = ({page, pageSize}: {page: number, pageSize: number}) => {
    return new Promise((resolve, reject) => {
        try {
            Worker.find().skip(page * pageSize).limit(pageSize).then((response) => {
                resolve({data: response});
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}

export const getSuggestedCategoriesService = () => {
    return new Promise((resolve, reject) => {
        try {
            Worker.find().limit(10).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const getCategorySearchService = ({key, page, pageSize}: {key: string, page: number, pageSize: number}) => {
    return new Promise((resolve, reject) => {
        try {
            Worker.find(
                (
                    key ? {
                        $or: [
                            {
                                title: {
                                    $regex: key,
                                    $options: 'i'
                                }
                            },{
                                skill: {
                                    $regex: key,
                                    $options: 'i'
                                }
                            }
                        ]
                    }
                    :
                    {}
                )
            ).skip(page * pageSize).limit(pageSize).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occured!"})
        }
    })
}

export const getMostBookedWorkers = ({page, pageSize}: {page: string, pageSize: string}) => {
    return new Promise((resolve, reject) => {
        try {
            Proposal.aggregate([
                {
                    $group: {
                        _id: "$workerId",
                        countOfWorks: {
                            $sum: 1
                        }
                    }
                },{
                    $sort: {
                        countOfWorks: -1
                    }
                },{
                    $skip: (page === undefined || pageSize === undefined) ? 0 : (parseInt(page) * parseInt(pageSize))
                },{
                    $limit: (page === undefined) ? 1 : parseInt(pageSize)
                }
            ]).then((response) => {
                resolve({data: response});
            }).catch((error) => {
                reject({status: 502, error: "Database error occured!"})
            })
        } catch (error) {
            reject({status: 500, error: new Error("Internal error occured!")})
        }
    })
}