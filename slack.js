const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));
const server = app.listen(3001);
const io = socketio(server);

io.on('connection', (socket) => {
    // Build an array to send back with the img and endpoint for each namespace
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    });

    // Send nsData to client
    socket.emit('nsList', nsData);
});

namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
        nsSocket.on('joinRoom', async (roomToJoin) => {
            // Deal with history... Once we have it.
            nsSocket.join(roomToJoin);
            const clients = await nsSocket.in(roomToJoin).allSockets();
            // numberOfUsersCallback(clients.size);
            io.of('/wiki').in(roomToJoin).emit('updateMembers', clients.size);

            const nsRoom = namespaces[0].rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            });
            nsSocket.emit('history', nsRoom.history);
        });

        nsSocket.on('newMessageToServer', (msg) => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: 'ashie',
                avatar: 'https://via.placeholder.com/30'
            };
            // Send this message to all the sockets that are in the room this SOCKET is in.
            // Room should always on index [1] Set(2) { '12SP7zQIAw4OYQmwAAAH', 'New Articles' }
            const roomTitle = Array.from(nsSocket.rooms)[1];
            const nsRoom = namespaces[0].rooms.find((room) => {
                return room.roomTitle === roomTitle;
            });
            console.log(nsRoom);
            nsRoom.addMessage(fullMsg);
            io.of('/wiki').to(roomTitle).emit('messageToClients', fullMsg);
        });
    });
})