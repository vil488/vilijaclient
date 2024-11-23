// Праверка наяўнасці токена ў localStorage
if (!localStorage.getItem('token')) {
    // Калі токен не знойдзены, перанакіроўваем на старонку лагіна
    window.location.href = 'index.html';
}

// Ініцыялізуем падключэнне WebSocket пасля таго, як скрыпт socket.io загружаны
const socket = io('https://vilija.onrender.com', {
    auth: {
        token: localStorage.getItem('token'), // Перадача токена пры падключэнні
    },
});

socket.on('connect', () => {
    console.log('Падключана да WebSocket сервера!');
});

// Функцыя для адпраўкі паведамлення
function sendMessage() {
    const input = document.getElementById('chatInput');
    
    if (input.value.trim() !== '') {
        socket.emit('message', {
            sender: 'Карыстальнік 1', // Тут можна ўставіць рэальнае імя карыстальніка
            text: input.value.trim(),
        });

        input.value = ''; // Ачышчэнне поля ўводу
    }
}




// Абнаўленне спісу паведамленняў пры падключэнні
socket.on('message', (message) => {
    const messages = document.getElementById('chatMessages');
    
    // Стварыць элементы для паведамлення
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';

    const usernameElement = document.createElement('div');
    usernameElement.className = 'chat-message-username';
    usernameElement.textContent = message.sender; // Адлюстроўваем імя адпраўніка

    const textElement = document.createElement('div');
    textElement.textContent = message.text;

    // Дадаць элементы ў паведамленне
    messageElement.appendChild(usernameElement);
    messageElement.appendChild(textElement);
    messages.appendChild(messageElement);
    
    // Пракрутка ўніз
    messages.scrollTop = messages.scrollHeight;
});

// Абработчык для кнопкі тэмы
document.getElementById('theme').addEventListener('click', function () {
    // Змяняем клас тэмы ў body
    document.body.classList.toggle('light-theme');
    
    // Захоўваем стан тэмы ў LocalStorage
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
});

// Правяраем захаваную тэму пры загрузцы старонкі
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
});

// Функцыя для выхаду
function logout() {
    // Выдаляем токен з localStorage
    localStorage.removeItem('token');
    // Перанакіроўваем на старонку лагіна
    window.location.href = 'index.html'; // Замяніце на старонку лагіна
}

// Абработчык націску на кнопку "logout"
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', logout);
