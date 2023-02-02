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
    });
})