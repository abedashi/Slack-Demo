const joinRoom = (roomName) => {
    nsSocket.emit('joinRoom', roomName);

    nsSocket.on('history', (history) => {
        // console.log(history);
        const messagesUI = document.querySelector('#messages');
        messagesUI.innerHTML = '';
        history.forEach((msg) => {
            const newMsg = buildHTML(msg);
            messagesUI.innerHTML += newMsg;
        });
        messagesUI.scrollTo(0, messagesUI.scrollHeight);
    });

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user">`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    });

    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', (event) => {
        let messages = document.querySelectorAll('.message-text');
        messages.forEach((msg) => {
            if (msg.innerHTML.toLocaleLowerCase().indexOf(event.target.value.toLocaleLowerCase()) === -1) {
                msg.closest('li').style.display = 'none';
            } else {
                msg.closest('li').style.display = 'flex';
            }
        })
    });
};