import mongoose from "mongoose";
import Proposal from "../model/proposalSchema";

interface AddProposalServiceProps {
    userId: string;
    workerId: string;
    chosenCategoryId: string;
    wage: number;
    isFullDay: boolean;
    isBeforeNoon: boolean;
    proposedDate: number;
    workDescription: string;
    proposedAddressId: string;
}

export const addProposalService = ({workerId, chosenCategoryId, wage, isFullDay, isBeforeNoon, proposedDate, workDescription, proposedAddressId, userId}: AddProposalServiceProps) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(workerId === userId){
                return reject({status: 400, error: "worker and user cannot be same"})
            }
            const proposalData = await Proposal.find({
                workerId: new mongoose.Types.ObjectId(workerId),
                isFullDay,
                ...(isFullDay ? {} : {
                    isBeforeNoon
                })
            })

            const isWorkerBusy = proposalData?.reduce((acc: any, curr: any) => {
                return curr.proposedDate === proposedDate || acc === true;
            }, false)
            if(isWorkerBusy){
                return reject({status: 409, error: "Worker is busy on the given date"})
            }
            Proposal.create({
                userId: new mongoose.Types.ObjectId(userId),
                workerId: new mongoose.Types.ObjectId(workerId),
                chosenCategoryId: new mongoose.Types.ObjectId(chosenCategoryId),
                wage,
                isFullDay,
                isBeforeNoon,
                proposedDate: proposedDate,
                workDescription,
                proposedAddressId,
                timestamp: new Date()
            }).then((response: any) => {
                response = response.toObject();
                response.timestamp = response.timestamp.getTime();
                response.proposedDate = response.proposedDate;
                resolve({data: response})
            }).catch((error) => {
                console.log(error)
                reject({status: 502, error: "Database error occurred"})
            })
        } catch (error) {
            console.log(error)
            reject({status: 500, error: "Internal error occurred"})
        }
    })
}

interface GetProposalServiceProps {
    userId: string;
    page: string;
    pageSize: string;
}
export const getProposalsService = ({userId, page, pageSize}: GetProposalServiceProps) => {
    return new Promise((resolve, reject) => {
        try {

            Proposal.aggregate([
                {
                    $match: {
                        workerId: new mongoose.Types.ObjectId(userId),
                        isWorkerDeleted: false,
                        status: true,
                        isAccepted: false,
                        isRejected: false
                    }
                },{
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData"
                    }
                },{
                    $lookup: {
                        from: "workers",
                        localField: "chosenCategoryId",
                        foreignField: "_id",
                        as: "categoryData"
                    }
                },{
                    $lookup: {
                        from: "addresses",
                        localField: "proposedAddressId",
                        foreignField: "_id",
                        as: "addressData"
                    }
                },{
                    $project: {
                        userId: 1,
                        firstName: {
                            $arrayElemAt: [
                                "$userData.firstName",
                                0
                            ]
                        },
                        lastName: {
                            $arrayElemAt: [
                                "$userData.lastName",
                                0
                            ]
                        },
                        profileImageUrl: {
                            $arrayElemAt: [
                                "$userData.profilePicture",
                                0
                            ]
                        },
                        categoryTitle: {
                            $arrayElemAt: [
                                "$categoryData.title",
                                0
                            ]
                        },
                        categorySkill: {
                            $arrayElemAt: [
                                "$categoryData.skill",
                                0
                            ]
                        },
                        proposedDate: 1,
                        wage: 1,
                        isFullDay: 1,
                        isBeforeNoon: 1,
                        address: {
                            $first: "$addressData"
                        },
                        workDescription: 1,
                        timestamp: {
                            $toLong: "$timestamp"
                        }
                    }
                },{
                    $skip: (page === undefined || pageSize === undefined) ? 0 : (parseInt(page) * parseInt(pageSize))
                },{
                    $limit: parseInt(pageSize)
                }
            ]).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                console.log(error)
                reject({status: 502, error: "Database error occurred"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occurred"})
        }
    })
}

interface AcceptProposalServiceProps {
    proposalId: string,
    userId: string
}
export const acceptProposalService = ({ proposalId, userId}: AcceptProposalServiceProps) => {
    return new Promise(async (resolve, reject) => {
        try {
            const proposalData = await Proposal.findOne({ _id: new mongoose.Types.ObjectId(proposalId)});
            if(!proposalData){
                return reject({status: 400, error: "proposal doesn't exit"})
            }
            if(proposalData.workerId?.toString() !== userId){
                return reject({status: 400, error: "The proposal can't be modified by the worker"})
            }
            Proposal.updateOne({
                workerId: new mongoose.Types.ObjectId(userId),
                _id: new mongoose.Types.ObjectId(proposalId)
            },{
                $set: {
                    isAccepted: true,
                    isRejected: false
                }
            }).then((response) => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: "Database error occurred"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occurred"})
        }
    })
}

interface RejectProposalServiceProps {
    proposalId: string,
    userId: string
}
export const rejectProposalService = ({ proposalId, userId}: RejectProposalServiceProps) => {
    return new Promise(async (resolve, reject) => {
        try {
            const proposalData = await Proposal.findOne({ _id: new mongoose.Types.ObjectId(proposalId)});
            if(!proposalData){
                return reject({status: 400, error: "proposal doesn't exit"})
            }
            if(proposalData.workerId?.toString() !== userId){
                return reject({status: 400, error: "The proposal can't be modified by the worker"})
            }
            Proposal.updateOne({
                workerId: new mongoose.Types.ObjectId(userId),
                _id: new mongoose.Types.ObjectId(proposalId)
            },{
                $set: {
                    isAccepted: false,
                    isRejected: true
                }
            }).then((response) => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: "Database error occurred"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occurred"})
        }
    })
}

export const completeProposalService = ({ proposalId, userId}: RejectProposalServiceProps) => {
    return new Promise(async (resolve, reject) => {
        try {
            const proposalData = await Proposal.findOne({ _id: new mongoose.Types.ObjectId(proposalId)});
            if(!proposalData){
                return reject({status: 400, error: "proposal doesn't exit"})
            }
            if(proposalData.workerId?.toString() !== userId && proposalData.userId?.toString() !== userId){
                return reject({status: 400, error: "The proposal can't be modified by the user"})
            }
            Proposal.updateOne({
                $or: [
                    {
                        _id: new mongoose.Types.ObjectId(proposalId),
                        userId: new mongoose.Types.ObjectId(userId)
                    },{
                        _id: new mongoose.Types.ObjectId(proposalId),
                        workerId: new mongoose.Types.ObjectId(userId)
                    }
                ]
            },{
                $set: {
                    isCompleted: true
                }
            }).then((response) => {
                resolve({data: 'done'})
            }).catch((error) => {
                reject({status: 502, error: "Database error occurred"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occurred"})
        }
    })
}

interface GetReportProps {
    fromDate: string,
    toDate: string,
    workHistory: string,
    hiringHistory: string,
    pendingWorks: string,
    completedWorks: string,
    cancelledWorks: string,
    userId: string,
    page: string,
    pageSize: string
}

export const getReportService = ({ fromDate, toDate, workHistory, hiringHistory, pendingWorks, completedWorks, cancelledWorks, userId, page, pageSize  }: GetReportProps) => {
    return new Promise(async (resolve, reject) => {
        try {
            const str = 'true'
            Proposal.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                proposalDate: {
                                    $gte: parseInt(fromDate)
                                }
                            },{
                                proposalDate: {
                                    $lte: parseInt(toDate)
                                }
                            }
                        ],
                        ...(workHistory === 'true' ? {
                            workerId: new mongoose.Types.ObjectId(userId)
                        } : {}),
                        ...(hiringHistory === 'true' ? {
                            userId: new mongoose.Types.ObjectId(userId)
                        } : {}),
                        ...((pendingWorks === str && completedWorks === str && cancelledWorks === str) ? {} :
                        (pendingWorks === str && completedWorks === str) ? {
                            isUserDeleted: false,
                            isWorkerDeleted: false,
                        } : (pendingWorks === str && cancelledWorks === str) ? {
                            isCompleted: false
                        } : (completedWorks === str && cancelledWorks === str) ? {
                            $or: [
                                {
                                    isCompleted: true
                                },{
                                    isUserDeleted: true
                                },{
                                    isWorkerDeleted: true
                                }
                            ]
                        } : (pendingWorks === str) ? {
                            isCompleted: false,
                            isUserDeleted: false,
                            isWorkerDeleted: false
                        } : (completedWorks === str) ? {
                            isCompleted: true
                        } : (cancelledWorks === str) ? {
                            $or: [
                                {
                                    isUserDeleted: true
                                },{
                                    isWorkerDeleted: true
                                }
                            ]
                        } : {})
                    }
                },{
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },{
                    $lookup: {
                        from: "users",
                        localField: "workerId",
                        foreignField: "_id",
                        as: "workerDetails"
                    }
                },{
                    $lookup: {
                        from: "addresses",
                        localField: "proposedAddressId",
                        foreignField: "_id",
                        as: "addressDetails"
                    }
                },{
                    $lookup: {
                        from: "workers",
                        localField: "chosenCategoryId",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },{
                    $project: {
                        _id: 1,
                        userId: 1,
                        workerId: 1,
                        userImageUrl: {
                            $arrayElemAt: [
                                "$userDetails.profilePicture",
                                0
                            ]
                        },
                        workerImageUrl: {
                            $arrayElemAt: [
                                "$userDetails.profilePicture",
                                0
                            ]
                        },
                        workDescription: 1,
                        wage: 1,
                        proposedDate: 1,
                        proposedAddress: {
                            $first: "$addressDetails"
                        },
                        isFullDay: 1,
                        isBeforeNoon: 1,
                        categoryTitle: {
                            $arrayElemAt: [
                                "$categoryDetails.title",
                                0
                            ]
                        },
                        categorySkill: {
                            $arrayElemAt: [
                                "$categoryDetails.skill",
                                0
                            ]
                        },
                        isAccepted: 1,
                        isCompleted: 1,
                        isUserDeleted: 1,
                        isWorkerDeleted: 1,
                    }
                },{
                    $skip: (page === undefined || pageSize === undefined) ? 0 : (parseInt(page) * parseInt(pageSize))
                },{
                    $limit: pageSize === undefined ? -1 : parseInt(pageSize)
                }
            ]).then((response) => {
                resolve({data: response})
            }).catch((error) => {
                console.log(error)
                reject({status: 502, error: "Database error occurred"})
            })
        } catch (error) {
            reject({status: 500, error: "Internal error occurred"})
        }
    })
}