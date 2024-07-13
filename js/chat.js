const usernameInput = document.getElementById('usernameInput');
const $chatElement = document.getElementById('chat');
const $messageInput = document.getElementById('messageInput');
const $disconnectBtn = document.getElementById('disconnect-btn');

let username = '';
let socket;

function connectToChat() {
    username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('name', username);
        document.getElementById('usernameForm').style.display = 'none';
        document.getElementById('chat').style.display = 'flex';
        document.getElementById('message').style.display = 'flex';

        socket = io('https://cinexunidos-production.up.railway.app', {
            auth: { name: username }
        });

        socket.on('connect', () => {
            console.log('Conectado');
        });

        socket.on('disconnect', () => {
            console.log('Desconectado');
        });

        socket.on('new-message', renderMessage);
    } else {
        alert('Por favor, introduce un nombre de usuario válido.');
    }
}

function sendMessage() {
    const message = $messageInput.value.trim();
    if (message) {
        socket.emit('send-message', message); // Enviar solo el mensaje como texto
        $messageInput.value = ''; // Limpiar el input
    }
}

function renderMessage(payload) {
    const { message, name } = payload;
    const $divElement = document.createElement('div');
    $divElement.classList.add('message');
    $divElement.classList.add(name === username ? 'outgoing' : 'incoming');
    $divElement.innerHTML = `<small><strong>${name}</strong></small><p>${message}</p>`;
    $chatElement.appendChild($divElement);
    $chatElement.scrollTop = $chatElement.scrollHeight; // Scroll al final de los mensajes
}

$disconnectBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    localStorage.removeItem('name');
    socket.close();
    window.location.reload();
});

