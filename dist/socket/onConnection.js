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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onConnection = void 0;
const onMessage_1 = require("./onMessage");
const getOverallMessages_1 = require("./getOverallMessages");
const onConnection = (clients) => {
    return (socket) => __awaiter(void 0, void 0, void 0, function* () {
        // const token = socket.handshake.query.token as string;
        // let decodedData = await verifyUserService({token}) as {data: string}
        // const userId = decodedData.data;
        console.log("A user connected");
        const userId = socket.handshake.query.userId;
        clients[userId] = socket;
        socket.on('message', (0, onMessage_1.onMessage)(userId, clients));
        socket.on('overall-messages', (0, getOverallMessages_1.getOverallMessages)(userId, clients));
        socket.on('disconnect', () => {
            socket.emit("disconnect");
        });
    });
};
exports.onConnection = onConnection;
