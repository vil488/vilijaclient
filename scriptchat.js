
const socket = io('https://vilija.onrender.com', {
    auth: {
        token: localStorage.getItem('token'), // Перадача токена пры падключэнні
    },
});



let offset = 0;
let loadingHistory = false;
let noMoreHistory = false; 

const messagesContainer = document.getElementById('chatMessages');

socket.on('connect', () => {
    console.log('Socket connected');
    fetchAndDecryptKey()  
});

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
});






let secretKey = ''; //сам ключ

let SECRET_KEY = '';//для расшыфроўкі ключа(nое што ўводзіць крыстальнік)

// Функцыя для запыту і дэшыфроўкі ключа
async function fetchAndDecryptKey(SECRET_KEY) {
    try {
        const response = await fetch('https://vilija.onrender.com/get-key');
        const data = await response.json();
        
         // Праверка, што вяртаецца з сервера

        if (data.key) {
            const bytes = CryptoJS.AES.decrypt(data.key, SECRET_KEY);
            secretKey = bytes.toString(CryptoJS.enc.Utf8);

            if (!secretKey) {
                console.error('Дэшыфроўка вярнула пусты ключ. Праверце SECRET_KEY.');
            }
        } else {
            console.error('Не атрыманы ключ з сервера.');
        }
    } catch (error) {
        console.error('Памылка падчас запыту або дэшыфроўкі:', error);
    }
}





async function initializeChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (!SECRET_KEY) {
        chatMessages.innerHTML = '<p>Увядзіце ключ:</p>';
        return;
    }

    // Чакаем дэшыфроўку ключа
    await fetchAndDecryptKey();

    if (secretKey) {
        chatMessages.innerHTML = '<p id="logtext">Ключ захаваны. Цяпер вы можаце выкарыстоўваць чат.</p>';
        loadHistory();
    } else {
        console.error('Немагчыма дэшыфраваць ключ.');
    }
}










async function setSecretKey() {
    console.log('сетСікретКей функцыя запусцілася');
    const inputField = document.getElementById('chatInput');
    const inputValue = inputField.value.trim();

    if (inputValue === '') {
        console.warn('Ключ не можа быць пустым.');
        return;
    }

    SECRET_KEY = inputValue; // Захоўваем уведзены ключ
    inputField.value = ''; // Ачышчаем поле ўводу

    // Спрабуем дэшыфраваць ключ і абнавіць інтэрфейс
    await fetchAndDecryptKey(SECRET_KEY);

    if (secretKey) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '<p id="logtext">Ключ захаваны. Цяпер вы можаце выкарыстоўваць чат.</p>';
        inputField.placeholder = 'Увядзіце паведамленне...';
        loadHistory();
    } else {
        
       
        console.error('Не атрымалася дэшыфраваць ключ. Праверце ваш SECRET_KEY.');
    }

    
}




function encryptMessage(message, secretKey) {
    // Шыфруем паведамленне з дапамогай AES і пераўтворым у радок
    return CryptoJS.AES.encrypt(message, secretKey).toString();
}

function decryptMessage(encryptedMessage, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}







// Функцыя для фарматавання часу (гадзіна і хвіліна)
function formatTime(dateString) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
    };
    const date = new Date(dateString); // Пераўтворыце timestamp у аб'ект Date
    return new Intl.DateTimeFormat('en-GB', options).format(date); // Вяртае гадзіну і хвіліну
}



let messagesArray = [];  // Масіў для захоўвання паведамленняў


function loadHistory() {
    if (loadingHistory || noMoreHistory) return; // Спыняем, калі ідзе загрузка або гісторыя скончылася
    loadingHistory = true;

    socket.emit('load history', { offset }, (messages) => {
        if (messages.length === 0) {
            console.log('No more messages to load.');
            noMoreHistory = true;
            loadingHistory = false;
            return;
        }

        if (!secretKey) {
            console.warn('Секрэтны ключ адсутнічае. Немагчыма дэкрыпіраваць паведамленні.');
            loadingHistory = false;
            return;
        }

        const decryptedMessages = messages.map((message) => ({
            sender: message.sender,
            color: message.color,
            text: decryptMessage(message.text, secretKey),
            timestamp: message.timestamp,
        }));

        // Дадаем новыя паведамленні ў пачатак масіва
        messagesArray = [...decryptedMessages, ...messagesArray];

        // Сартыруем паведамленні па часу
        messagesArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Падлічваем offset
        offset += messages.length;

        // Адлюстроўваем паведамленні
        renderMessages();

        // Пасля рэндэрынгу пакідаем скрол на тым жа месцы, каб карыстальнік не губляў пазіцыю
        if (messagesContainer.scrollHeight > messagesContainer.offsetHeight) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.offsetHeight;
        }

        loadingHistory = false;
    });
}





function renderMessages() {
    // Ачышчаем кантэйнер перад адлюстраваннем новых паведамленняў
    messagesContainer.innerHTML = '';

    // Дадаем усе паведамленні ў кантэйнер
    messagesArray.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';

        // Імя карыстальніка
        const usernameElement = document.createElement('div');
        usernameElement.className = 'chat-message-username';
        usernameElement.textContent = message.sender;
        usernameElement.style.color = message.color;

        // Тэкст паведамлення
        const textElement = document.createElement('div');
        textElement.innerHTML = message.text.replace(/\n/g, '<br>');

        // Час паведамлення
        const timeElement = document.createElement('div');
        timeElement.className = 'chat-message-time';
        timeElement.textContent = formatTime(message.timestamp);

        // Дадаем элементы ў паведамленне
        messageElement.appendChild(usernameElement);
        messageElement.appendChild(textElement);
        messageElement.appendChild(timeElement);

        // Дадаем паведамленне ў кантэйнер
        messagesContainer.appendChild(messageElement);
    });

    // Скролім уніз пасля пачатковай загрузкі
    if (!loadingHistory && messagesContainer.scrollTop === 0) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}






messagesContainer.addEventListener('scroll', () => {
    if (messagesContainer.scrollTop === 0 && !noMoreHistory) {
        loadHistory(); // Загружаем гісторыю толькі калі яшчэ ёсць паведамленні
    }
});





// Абслугоўваем падзею скролу
messagesContainer.addEventListener('scroll', () => {
    if (messagesContainer.scrollTop === 0) {
        loadHistory();
    }
});





socket.on('message', (message) => {
    if (!secretKey) {
        console.warn('Секрэтны ключ адсутнічае. Немагчыма дэкрыпіраваць паведамленне.');
        return;
    }

    const decryptedMessage = {
        sender: message.sender,
        color: message.color,
        text: decryptMessage(message.text, secretKey),
        timestamp: message.timestamp,
    };

    // Дадаем новае паведамленне ў канец масіва
    messagesArray.push(decryptedMessage);

    // Сартыраваць усе паведамленні па часе
    messagesArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Адлюстроўваем новае паведамленне
    renderMessages();

    // Пракрутка ўніз пасля атрыманне новага паведамлення
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});



// Функцыя для адпраўкі паведамлення
function sendMessage() {
    if (secretKey === '') {
        console.warn('Секрэтны ключ адсутнічае. Немагчыма зашыфраваць і адпраўляць паведамленні.');
        setSecretKey();
        return;
       
    }

    const input = document.getElementById('chatInput');

    if (input.value.trim() !== '') {
        const color = localStorage.getItem('color') || '#FFFFFF';
        const encryptedMessage = encryptMessage(input.value.trim(), secretKey); // Шыфроўка паведамлення

        socket.emit('message', {
            text: encryptedMessage,
            senderColor: color,
        });

        input.value = ''; // Ачыстка поля ўводу
    }
}


const chatInput = document.getElementById("chatInput");

chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) { // Shift + Enter для новага радка
        event.preventDefault(); // Пазбегнуць пераносу радка
        sendMessage();
    }
});










// Абработчык для кнопкі тэмы
document.getElementById('theme').addEventListener('click', function () {
    document.body.classList.toggle('light-theme');

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
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}






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
                location.reload();  // Перазагружаем старонку
            } else {
                console.log('Немагчыма ачысціць чат');
            }
        })
        .catch(error => {
            console.error('Памылка:', error);
        });
});

document.getElementById('info').addEventListener('click', function () {
    if (localStorage.getItem('token')) {
        window.location.href = '/article';
    }
});

// Дадай выклік функцыі пасля загрузкі старонкі
window.onload = function() {
    initializeChat()
    fetchAndDecryptKey()

};
