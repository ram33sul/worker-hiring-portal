"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportService = exports.completeProposalService = exports.rejectProposalService = exports.acceptProposalService = exports.getProposalsService = exports.addProposalService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const proposalSchema_1 = __importDefault(require("../model/proposalSchema"));
const addProposalService = ({ workerId, chosenCategoryId, wage, isFullDay, isBeforeNoon, proposedDate, workDescription, proposedAddressId, userId }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (workerId === userId) {
                return reject({ status: 400, error: "worker and user cannot be same" });
            }
            const proposalData = yield proposalSchema_1.default.find(Object.assign({ workerId: new mongoose_1.default.Types.ObjectId(workerId), isFullDay }, (isFullDay ? {} : {
                isBeforeNoon
            })));
            const isWorkerBusy = proposalData === null || proposalData === void 0 ? void 0 : proposalData.reduce((acc, curr) => {
                return curr.proposedDate === proposedDate || acc === true;
            }, false);
            if (isWorkerBusy) {
                return reject({ status: 409, error: "Worker is busy on the given date" });
            }
            proposalSchema_1.default.create({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                workerId: new mongoose_1.default.Types.ObjectId(workerId),
                chosenCategoryId: new mongoose_1.default.Types.ObjectId(chosenCategoryId),
                wage,
                isFullDay,
                isBeforeNoon,
                proposedDate: proposedDate,
                workDescription,
                proposedAddressId,
                timestamp: new Date()
            }).then((response) => {
                response = response.toObject();
                response.timestamp = response.timestamp.getTime();
                response.proposedDate = response.proposedDate;
                resolve({ data: response });
            }).catch((error) => {
                console.log(error);
                reject({ status: 502, error: "Database error occurred" });
            });
        }
        catch (error) {
            console.log(error);
            reject({ status: 500, error: "Internal error occurred" });
        }
    }));
};
exports.addProposalService = addProposalService;
const getProposalsService = ({ userId, page, pageSize }) => {
    return new Promise((resolve, reject) => {
        try {
            proposalSchema_1.default.aggregate([
                {
                    $match: {
                        workerId: new mongoose_1.default.Types.ObjectId(userId),
                        isWorkerDeleted: false,
                        status: true,
                        isAccepted: false,
                        isRejected: false
                    }
                }, {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData"
                    }
                }, {
                    $lookup: {
                        from: "workers",
                        localField: "chosenCategoryId",
                        foreignField: "_id",
                        as: "categoryData"
                    }
                }, {
                    $lookup: {
                        from: "addresses",
                        localField: "proposedAddressId",
                        foreignField: "_id",
                        as: "addressData"
                    }
                }, {
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
                }, {
                    $skip: (page === undefined || pageSize === undefined) ? 0 : (parseInt(page) * parseInt(pageSize))
                }, {
                    $limit: parseInt(pageSize)
                }
            ]).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                console.log(error);
                reject({ status: 502, error: "Database error occurred" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occurred" });
        }
    });
};
exports.getProposalsService = getProposalsService;
const acceptProposalService = ({ proposalId, userId }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const proposalData = yield proposalSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(proposalId) });
            if (!proposalData) {
                return reject({ status: 400, error: "proposal doesn't exit" });
            }
            if (((_a = proposalData.workerId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
                return reject({ status: 400, error: "The proposal can't be modified by the worker" });
            }
            proposalSchema_1.default.updateOne({
                workerId: new mongoose_1.default.Types.ObjectId(userId),
                _id: new mongoose_1.default.Types.ObjectId(proposalId)
            }, {
                $set: {
                    isAccepted: true,
                    isRejected: false
                }
            }).then((response) => {
                resolve({ data: 'done' });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occurred" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occurred" });
        }
    }));
};
exports.acceptProposalService = acceptProposalService;
const rejectProposalService = ({ proposalId, userId }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const proposalData = yield proposalSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(proposalId) });
            if (!proposalData) {
                return reject({ status: 400, error: "proposal doesn't exit" });
            }
            if (((_a = proposalData.workerId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
                return reject({ status: 400, error: "The proposal can't be modified by the worker" });
            }
            proposalSchema_1.default.updateOne({
                workerId: new mongoose_1.default.Types.ObjectId(userId),
                _id: new mongoose_1.default.Types.ObjectId(proposalId)
            }, {
                $set: {
                    isAccepted: false,
                    isRejected: true
                }
            }).then((response) => {
                resolve({ data: 'done' });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occurred" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occurred" });
        }
    }));
};
exports.rejectProposalService = rejectProposalService;
const completeProposalService = ({ proposalId, userId }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const proposalData = yield proposalSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(proposalId) });
            if (!proposalData) {
                return reject({ status: 400, error: "proposal doesn't exit" });
            }
            if (((_a = proposalData.workerId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId && ((_b = proposalData.userId) === null || _b === void 0 ? void 0 : _b.toString()) !== userId) {
                return reject({ status: 400, error: "The proposal can't be modified by the user" });
            }
            proposalSchema_1.default.updateOne({
                $or: [
                    {
                        _id: new mongoose_1.default.Types.ObjectId(proposalId),
                        userId: new mongoose_1.default.Types.ObjectId(userId)
                    }, {
                        _id: new mongoose_1.default.Types.ObjectId(proposalId),
                        workerId: new mongoose_1.default.Types.ObjectId(userId)
                    }
                ]
            }, {
                $set: {
                    isCompleted: true
                }
            }).then((response) => {
                resolve({ data: 'done' });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occurred" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occurred" });
        }
    }));
};
exports.completeProposalService = completeProposalService;
const getReportService = ({ fromDate, toDate, workHistory, hiringHistory, pendingWorks, completedWorks, cancelledWorks, userId, page, pageSize }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const str = 'true';
            proposalSchema_1.default.aggregate([
                {
                    $match: Object.assign(Object.assign({ proposedDate: {
                            $gte: parseInt(fromDate),
                            $lte: parseInt(toDate)
                        } }, ((workHistory === str && hiringHistory === str) ? {
                        $or: [
                            {
                                workerId: new mongoose_1.default.Types.ObjectId(userId)
                            }, {
                                userId: new mongoose_1.default.Types.ObjectId(userId)
                            }
                        ]
                    } :
                        workHistory === 'true' ? {
                            workerId: new mongoose_1.default.Types.ObjectId(userId)
                        } :
                            hiringHistory === 'true' ? {
                                userId: new mongoose_1.default.Types.ObjectId(userId)
                            } : {
                                $or: [
                                    {
                                        workerId: new mongoose_1.default.Types.ObjectId(userId)
                                    }, {
                                        userId: new mongoose_1.default.Types.ObjectId(userId)
                                    }
                                ]
                            })), ((pendingWorks === str && completedWorks === str && cancelledWorks === str) ? {} :
                        (pendingWorks === str && completedWorks === str) ? {
                            isUserDeleted: false,
                            isWorkerDeleted: false,
                        } : (pendingWorks === str && cancelledWorks === str) ? {
                            isCompleted: false
                        } : (completedWorks === str && cancelledWorks === str) ? {
                            $or: [
                                {
                                    isCompleted: true
                                }, {
                                    isUserDeleted: true
                                }, {
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
                                }, {
                                    isWorkerDeleted: true
                                }
                            ]
                        } : {}))
                }, {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                }, {
                    $lookup: {
                        from: "users",
                        localField: "workerId",
                        foreignField: "_id",
                        as: "workerDetails"
                    }
                }, {
                    $lookup: {
                        from: "addresses",
                        localField: "proposedAddressId",
                        foreignField: "_id",
                        as: "addressDetails"
                    }
                }, {
                    $lookup: {
                        from: "workers",
                        localField: "chosenCategoryId",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                }, {
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
                                "$workerDetails.profilePicture",
                                0
                            ]
                        },
                        oppositeFirstName: {
                            $cond: [
                                {
                                    $eq: [
                                        "$userId",
                                        new mongoose_1.default.Types.ObjectId(userId)
                                    ]
                                },
                                {
                                    $arrayElemAt: [
                                        "$workerDetails.firstName",
                                        0
                                    ]
                                }, {
                                    $arrayElemAt: [
                                        "$userDetails.firstName",
                                        0
                                    ]
                                }
                            ]
                        },
                        oppositeLastName: {
                            $cond: [
                                {
                                    $eq: [
                                        "$userId",
                                        new mongoose_1.default.Types.ObjectId(userId)
                                    ]
                                },
                                {
                                    $arrayElemAt: [
                                        "$workerDetails.lastName",
                                        0
                                    ]
                                }, {
                                    $arrayElemAt: [
                                        "$userDetails.lastName",
                                        0
                                    ]
                                }
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
                        isProposalSentByUser: {
                            $eq: ['$workerId', new mongoose_1.default.Types.ObjectId(userId)]
                        }
                    }
                }
            ]).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                console.log(error);
                reject({ status: 502, error: "Database error occurred" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occurred" });
        }
    }));
};
exports.getReportService = getReportService;
