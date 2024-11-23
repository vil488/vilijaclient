
// Праверка наяўнасці токена ў localStorage
if (!localStorage.getItem('token')) {
    // Калі токен не знойдзены, перанакіроўваем на старонку лагіна
    window.location.href = 'index.html';
}

// Функцыя для адпраўкі паведамлення


function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    
    if (input.value.trim() !== '') {
        const message = document.createElement('div'); // Контэйнер для паведамлення
        message.className = 'chat-message'; // Выкарыстанне класа для стылю

        const username = document.createElement('div'); // Элемент для імя
        username.textContent = 'Карыстальнік 1'; // Задаем імя
        username.className = 'chat-message-username'; // Выкарыстанне класа для стылю

        const text = document.createElement('div'); // Элемент для тэксту
        text.textContent = input.value.trim();

        message.appendChild(username); // Дадаем імя ў паведамленне
        message.appendChild(text); // Дадаем тэкст паведамлення
        messages.appendChild(message); // Дадаем паведамленне ў блок
        messages.scrollTop = messages.scrollHeight; // Пракрутка ўніз
        input.value = ''; // Ачысціць поле ўводу
    }
}

    
    
    
    // // Апрацоўка падзей на клавіятуры
    // textarea.addEventListener('keydown', (event) => {
    //     if (event.key === 'Enter') {
    //         if (event.shiftKey) {
    //             // Калі націснуты Shift + Enter, дадаем новы радок
    //             return; // Нічога не робім, каб не адпраўляць паведамленне
    //         }
    //         event.preventDefault(); // Каб не было пераносу радка на Enter
    //         sendMessage(); // Адпраўка паведамлення
    //     }
    // });
    

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
    
   // Дадаем абработчык для кнопкі выхаду
const logoutButton = document.getElementById('logout');  // Паказваем на элемент кнопкі з id "logout"

logoutButton.addEventListener('click', logout);  // Дадаем абработчык падзеі націску

// // Функцыя для выхаду
function logout() {
    // Выдаляем токен з localStorage
    localStorage.removeItem('token'); // Замяніце 'token' на імя вашага токена

    // Перанакіроўваем на старонку лагіна
    window.location.href = 'index.html'; // Замяніце 'login.html' на URL вашай старонкі лагіна
}
