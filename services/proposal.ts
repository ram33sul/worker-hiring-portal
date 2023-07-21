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
            const proposedDateInDate = new Date(proposedDate)
            const proposalData = await Proposal.find({
                workerId: new mongoose.Types.ObjectId(workerId),
                isFullDay,
                isBeforeNoon,
            })
            const isWorkerBusy = proposalData?.reduce((acc: any, curr: any) => {
                const proposedDateString1 = `${curr.proposedDate.getDate()}${curr.proposedDate.getMonth()}${curr.proposedDate.getFullYear()}`;
                const proposedDateString2 = `${proposedDateInDate.getDate()}${proposedDateInDate.getMonth()}${proposedDateInDate.getFullYear()}`;
                return proposedDateString1 === proposedDateString2 || acc === true;
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
                proposedDate: proposedDateInDate,
                workDescription,
                proposedAddressId,
                timestamp: new Date()
            }).then((response: any) => {
                response = response.toObject();
                response.timestamp = response.timestamp.getTime();
                response.proposedDate = response.proposedDate.getTime();
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
                        status: true
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
                        proposedDate: {
                            $toLong: "$proposedDate"
                        },
                        wage: 1,
                        isFullDay: 1,
                        isBeforeNoon: 1,
                        address: {
                            $first: "$addressData"
                        }
                    }
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
            if(JSON.stringify(proposalData?.userId) !== userId || !proposalData?._id){
                return reject({status: 400, error: "proposal doesn't exit or the proposal wasn't added by the user"})
            }
            Proposal.updateOne({
                userId: new mongoose.Types.ObjectId(userId),
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
            if(JSON.stringify(proposalData?.userId) !== userId || !proposalData?._id){
                return reject({status: 400, error: "proposal doesn't exit or the proposal wasn't added by the user"})
            }
            Proposal.updateOne({
                userId: new mongoose.Types.ObjectId(userId),
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