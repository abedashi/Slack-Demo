const buildHTML = (msg) => {
    const convertedDate = new Date(msg.time).toLocaleString();
    const newMessage = `
        <li>
            <div class="user-image">
                <img src=${msg.avatar} />
            </div>
            <div class="user-message">
                <div class="user-name-time">${msg.username}<span> ${convertedDate}</span></div>
                <div class="message-text">${msg.text}.</div>
            </div>
        </li>
    `;
    return newMessage;
};

const joinNs = (endpoint) => {
    const nsSocket = io(`http://localhost:3001${endpoint}`);
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        nsRooms.forEach((room) => {
            roomList.innerHTML += `
                <li class='room'>
                    <span class='glyphicon glyphicon-${room.privateRoom ? 'lock' : 'globe'}'></span>${room.roomTitle}
                </li>`
        });
        let roomNodes = document.querySelectorAll('.room');
        roomNodes.forEach((element) => {
            element.addEventListener('click', (event) => {
                console.log('Someone clicked on', event.target.innerText);
            });
        });

        // Add room automatically... first time here
        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        joinRoom(topRoomName, nsSocket);
    });

    nsSocket.on('messageToClients', (msg) => {
        console.log(msg);
        document.querySelector('#messages').innerHTML += buildHTML(msg);
        const messagesUI = document.querySelector('#messages');
        messagesUI.scrollTo(0, messagesUI.scrollHeight);
    });

    document.querySelector('.message-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        nsSocket.emit('newMessageToServer', { text: newMessage });
        document.querySelector('#user-message').value = '';
    });
};
