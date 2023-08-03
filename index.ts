import express from 'express';
import dotenv from 'dotenv';
import database from './config/database';
import apiRouter from './routes';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { onConnection } from './socket/onConnection';

dotenv.config();
database.connect();

const PORT = process.env.PORT;
const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server)

app.use(express.json());

app.use('/api', apiRouter);

app.use('/', (req, res) => {
    res.status(400).send({error: "Request URL cannot be found, please check the URL again!"})
});

const clients = {}

io.on('connection', onConnection(clients))

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
    console.log(`app listening on ${PORT}`)
});

