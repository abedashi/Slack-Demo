const socket = io('http://localhost:3001');
// const socket2 = io('http://localhost:3001/wiki');
// const socket3 = io('http://localhost:3001/mozilla');
// const socket4 = io('http://localhost:3001/linux');

socket.on('nsList', (nsData) => {
    console.log('The list of namespaces has arrived!');
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = '';
    nsData.forEach((ns) => {
        namespacesDiv.innerHTML += `
            <div class='namespace' ns=${ns.endpoint}>
                <img src='${ns.img}' />
            </div>`
    });

    document.querySelectorAll('.namespace').forEach((element) => {
        element.addEventListener('click', (event) => {
            const nsEndpoint = element.getAttribute('ns');
            console.log(`${nsEndpoint} I should go to now`);
        });
    });

    const nsSocket = io('http://localhost:3001/wiki');
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
    });
});