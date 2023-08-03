export const broadcast = ({data, from, to, clients, event}: any) => {
    const sender = clients[from];
    const reciever = clients[to];
    if(from && sender){
        sender.emit(event, data)
    }
    if(to && reciever){
        reciever.emit(event, data)
    }
}
