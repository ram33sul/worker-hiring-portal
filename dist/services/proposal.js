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
exports.rejectProposalService = exports.acceptProposalService = exports.getProposalsService = exports.addProposalService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const proposalSchema_1 = __importDefault(require("../model/proposalSchema"));
const addProposalService = ({ workerId, chosenCategoryId, wage, isFullDay, isBeforeNoon, proposedDate, workDescription, proposedAddressId, userId }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (workerId === userId) {
                return reject({ status: 400, error: "worker and user cannot be same" });
            }
            const proposedDateInDate = new Date(proposedDate);
            const proposalData = yield proposalSchema_1.default.find({
                workerId: new mongoose_1.default.Types.ObjectId(workerId),
                isFullDay,
                isBeforeNoon,
            });
            const isWorkerBusy = proposalData === null || proposalData === void 0 ? void 0 : proposalData.reduce((acc, curr) => {
                const proposedDateString1 = `${acc.proposedDate.getDate()}${acc.proposedDate.getMonth()}${acc.proposedDate.getFullYear()}`;
                const proposedDateString2 = `${proposedDateInDate.getDate()}${proposedDateInDate.getMonth()}${proposedDateInDate.getFullYear()}`;
                return proposedDateString1 === proposedDateString2 || curr === true;
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
                proposedDate: proposedDateInDate,
                workDescription,
                proposedAddressId,
                timestamp: new Date()
            }).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
                reject({ status: 502, error: "Database error occurred" });
            });
        }
        catch (error) {
            reject({ status: 500, error: "Internal error occurred" });
        }
    }));
};
exports.addProposalService = addProposalService;
const getProposalsService = ({ workerId }) => {
    return new Promise((resolve, reject) => {
        try {
            proposalSchema_1.default.aggregate([
                {
                    $match: {
                        workerId: new mongoose_1.default.Types.ObjectId(workerId),
                        isWorkerDeleted: false,
                        status: true
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
                        }
                    }
                }
            ]).then((response) => {
                resolve({ data: response });
            }).catch((error) => {
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
        try {
            const proposalData = yield proposalSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(proposalId) });
            if (JSON.stringify(proposalData === null || proposalData === void 0 ? void 0 : proposalData.userId) !== userId || !(proposalData === null || proposalData === void 0 ? void 0 : proposalData._id)) {
                return reject({ status: 400, error: "proposal doesn't exit or the proposal wasn't added by the user" });
            }
            proposalSchema_1.default.updateOne({
                userId: new mongoose_1.default.Types.ObjectId(userId),
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
        try {
            const proposalData = yield proposalSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(proposalId) });
            if (JSON.stringify(proposalData === null || proposalData === void 0 ? void 0 : proposalData.userId) !== userId || !(proposalData === null || proposalData === void 0 ? void 0 : proposalData._id)) {
                return reject({ status: 400, error: "proposal doesn't exit or the proposal wasn't added by the user" });
            }
            proposalSchema_1.default.updateOne({
                userId: new mongoose_1.default.Types.ObjectId(userId),
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
