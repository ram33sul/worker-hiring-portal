"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = void 0;
const broadcast = ({ data, from, to, clients, event }) => {
    const sender = clients[from];
    const reciever = clients[to];
    if (from && sender) {
        sender.emit(event, data);
    }
    if (to && reciever) {
        reciever.emit(event, data);
    }
};
exports.broadcast = broadcast;
