const socket = io('http://localhost:3001');

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
    joinNs('/wiki');
});
