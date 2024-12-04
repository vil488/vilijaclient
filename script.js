const loginButt = document.getElementsByClassName("login-button");

loginButt.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {  
        login();
    }});


document.querySelector('.login-button').addEventListener('click', function login () {
  const button = document.querySelector('.login-button');
  const spinner = document.querySelector('.loading-spinner');

  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;
  

  const errorMessageElement = document.getElementById('error-message');

   
  

  if (!username || !password) {
    errorMessageElement.textContent = 'Калі ласка, увядзіце лагін і пароль!';
    return;
  }

  // Паказваем спінер, змяняем колер кнопкі і блакуем яе
  button.classList.add('loading'); // Дадаем клас для празрыстасці
  spinner.style.display = 'block'; // Паказваем спінер
  button.disabled = true; // Блакуем кнопку

  
  // Запыт на сервер
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
        // localStorage.setItem('role', data.role);
        localStorage.setItem('color', data.color);
        // alert('Вітаем, ' + username + '!');
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
      // Хаваем спінер і вяртаем кнопку ў звычайны стан
      button.classList.remove('loading'); // Здымаем празрысты клас
      spinner.style.display = 'none'; // Хаваем спінер
      button.disabled = false; // Актывуем кнопку
    });
});



// Праверка сесіі пры загрузцы старонкі
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  if (token) {
    alert('Вы ўжо аўтарызаваны!');
    window.location.href = '/greeting';
  }
});



