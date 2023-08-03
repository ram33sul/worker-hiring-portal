"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const onConnection_1 = require("./socket/onConnection");
dotenv_1.default.config();
database_1.default.connect();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.use('/', (req, res) => {
    res.status(400).send({ error: "Request URL cannot be found, please check the URL again!" });
});
const clients = {};
io.on('connection', (0, onConnection_1.onConnection)(clients));
io.on('connection', (socket) => {
    console.log('A user connected!');
    socket.on('chatMessage', (message) => {
        console.log('Received message:', message);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected!');
    });
});
server.listen(PORT, () => {
    console.log(`app listening on ${PORT}`);
});
