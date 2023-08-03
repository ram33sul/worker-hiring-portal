import { Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { verifyUserService } from "../services/account";
import { onMessage } from "./onMessage";

export const onConnection = (clients: any) => {
    return async (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
        // const token = socket.handshake.query.token as string;
        // let decodedData = await verifyUserService({token}) as {data: string}
        // const userId = decodedData.data;
        const userId = socket.handshake.query.userId as string;
        clients[userId] = socket
        socket.on('message', onMessage(userId, clients))

        socket.on('disconnect', () => {
            socket.emit("disconnect")
        });
    }
}