const loginButt = document.querySelector(".login-button");

loginButt.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {  
        login();
    }
});

document.querySelector('.login-button').addEventListener('click', login);

function login() {
  const button = document.querySelector('.login-button');
  const spinner = document.querySelector('.loading-spinner');

  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  const errorMessageElement = document.getElementById('error-message');

  if (!username || !password) {
    errorMessageElement.textContent = 'Калі ласка, увядзіце лагін і пароль!';
    return;
  }

  button.classList.add('loading'); // Дадаем клас для празрыстасці
  spinner.style.display = 'block'; // Паказваем спінер
  button.disabled = true; // Блакуем кнопку

  fetch('https://vilija.onrender.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Няправільны лагін або пароль');
      }
      return response.json();
    })
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('color', data.color);
        window.location.href = '/greeting';
      } else {
        throw new Error('Не атрымалі токен ад сервера');
      }
    })
    .catch(error => {
      console.error("Памылка злучэння:", error);
      errorMessageElement.textContent = error.message;
      errorMessageElement.style.display = 'block'; // Паказваем памылку
    })
    .finally(() => {
      button.classList.remove('loading'); // Здымаем празрысты клас
      spinner.style.display = 'none'; // Хаваем спінер
      button.disabled = false; // Актывуем кнопку
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  if (token) {
    alert('Вы ўжо аўтарызаваны!');
    window.location.href = '/greeting';
  }
});

