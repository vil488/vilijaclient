document.querySelector('.login-button').addEventListener('click', function () {
  const button = document.querySelector('.login-button');
  const spinner = document.querySelector('.loading-spinner');

  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!username || !password) {
    alert('Калі ласка, увядзіце лагін і пароль!');
    return;
  }

  // Паказваем спінер і блакуем кнопку
  spinner.style.display = 'inline-block'; // Паказваем анімацыю
  button.disabled = true;

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
        alert('Вітаем, ' + username + '!');
        window.location.href = '/chat';
      } else {
        throw new Error('Не атрымалі токен ад сервера');
      }
    })
    .catch(error => {
      console.error('Памылка:', error);
      alert(error.message);
    })
    .finally(() => {
      // Хаваем спінер і адключаем блакаванне кнопкі
      spinner.style.display = 'none';
      button.disabled = false;
    });
});

// Праверка сесіі пры загрузцы старонкі
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  if (token) {
    alert('Вы ўжо аўтарызаваны!');
    window.location.href = '/chat';
  }
});
