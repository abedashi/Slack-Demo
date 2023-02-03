const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));
const server = app.listen(3001);
const io = socketio(server);

io.on('connection', (socket) => {
    // console.log(socket.handshake);
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

const updateMember = async (namespace, roomToJoin) => {
    const clients = await io.of(namespace.endpoint).in(roomToJoin).allSockets();
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.size);
};

namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        const username = nsSocket.handshake.query.username
        // console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin) => {
            // leave previous room
            const roomToLeave = Array.from(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            updateMember(namespace, roomToLeave);
            // Deal with history... Once we have it.
            nsSocket.join(roomToJoin);

            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            });
            nsSocket.emit('history', nsRoom.history);
            updateMember(namespace, roomToJoin);
        });

        nsSocket.on('newMessageToServer', (msg) => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: 'https://via.placeholder.com/30'
            };
            // Send this message to all the sockets that are in the room this SOCKET is in.
            // Room should always on index [1] Set(2) { '12SP7zQIAw4OYQmwAAAH', 'New Articles' }
            const roomTitle = Array.from(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;
            });
            // console.log(nsRoom);
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
        });
    });
})