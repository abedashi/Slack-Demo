const joinRoom = (roomName, nsSocket) => {
    nsSocket.emit('joinRoom', roomName);

    nsSocket.on('history', (history) => {
        // console.log(history);
        const messagesUI = document.querySelector('#messages');
        messagesUI.innerHTML = '';
        history.forEach((msg) => {
            const newMsg = buildHTML(msg);
            const currMessages = messagesUI.innerHTML;
            messagesUI.innerHTML = currMessages + newMsg;
        });
        messagesUI.scrollTo(0, messagesUI.scrollHeight);
    });

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user">`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    });
};