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

// Падключэнне да сервера
socket.on('connect', () => {
    console.log('Successfully connected to the server');
  
    // Абнаўленне гісторыі чата
    const chatHistory = getChatMessages();
    chatHistory.forEach(message => {
        message.color = message.color || '#FFFFFF'; // Па змоўчанні белы колер
    });
    socket.emit('chat history', chatHistory);
});

// Функцыя для фарматавання часу (гадзіна і хвіліна)
function formatTime(dateString) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
    };
    const date = new Date(dateString); // Пераўтворыце timestamp у аб'ект Date
    return new Intl.DateTimeFormat('en-GB', options).format(date); // Вяртае гадзіну і хвіліну
}

// Абнаўленне спісу паведамленняў пры загрузцы гісторыі
socket.on('chat history', (messages) => {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = ''; // Ачышчаем кантэйнер

    messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';

        const usernameElement = document.createElement('div');
        usernameElement.className = 'chat-message-username';
        usernameElement.style.color = message.color || '#FFFFFF'; // Колер карыстальніка
        usernameElement.textContent = message.sender;

        const textElement = document.createElement('div');
        textElement.textContent = message.text;

        const timeElement = document.createElement('div');
        timeElement.className = 'chat-message-time';
        timeElement.textContent = formatTime(message.timestamp);  // Фарматуем час толькі для гадзін і хвілін

        messageElement.appendChild(usernameElement);
        messageElement.appendChild(textElement);
        messageElement.appendChild(timeElement); // Дадаем час да паведамлення
        messagesContainer.appendChild(messageElement);
    });

    // Пракрутка ўніз пасля дадання ўсіх паведамленняў
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Абнаўленне спісу паведамленняў пры новых паведамленнях
// Абнаўленне спісу паведамленняў пры новых паведамленнях
socket.on('message', (message) => {
    const messagesContainer = document.getElementById('chatMessages');
  
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
  
    const usernameElement = document.createElement('div');
    usernameElement.className = 'chat-message-username';
    usernameElement.textContent = message.sender;
  
    // Задаем колер для імя карыстальніка
    usernameElement.style.color = message.color;  // Адпраўляемы калер у кожным паведамленні
  
    const textElement = document.createElement('div');
    textElement.textContent = message.text;
  
    const timeElement = document.createElement('div');
    timeElement.className = 'chat-message-time';
    timeElement.textContent = formatTime(message.timestamp); // Фарматуем час для кожнага паведамлення

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(textElement);
    messageElement.appendChild(timeElement); // Дадаем час
    messagesContainer.appendChild(messageElement);
  
    // Пракрутка ўніз
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});




// Функцыя для адпраўкі паведамлення
function sendMessage() {
    const input = document.getElementById('chatInput');

    if (input.value.trim() !== '') {
        // Атрымаць колер карыстальніка з localStorage, калі ён там ёсць
        const color = localStorage.getItem('color') || '#FFFFFF'; // Калі колер не знойдзены, усталёўваецца па змаўчанні белы

        socket.emit('message', {
            text: input.value.trim(),
            senderColor: color // Дадаць колер у паведамленне
        });

        input.value = ''; // Ачышчэнне поля ўводу
    }
}

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
    window.location.href = 'index.html';
}

// Абработчык націску на кнопку "logout"
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', logout);

// Абработчык націску на кнопку "очысціць чат"
document.getElementById('cleenchat').addEventListener('click', function () {
    fetch('https://vilija.onrender.com/clearMessages', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Чат ачышчаны');
            } else {
                console.log('Немагчыма ачысціць чат');
            }
        })
        .catch(error => {
            console.error('Памылка:', error);
        });
});
