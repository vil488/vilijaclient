document.querySelector('.login-button').addEventListener('click', function () {
  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!username || !password) {
    alert('Калі ласка, увядзіце лагін і пароль!');
    return;
  }

  // Запыт на сервер для праверкі лагіна
  fetch('https://vilija.onrender.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Няправільны лагін або пароль'); // Калі сервер вяртае статус 401 або іншую памылку
      }
      return response.json();
    })
    .then(data => {
      if (data.token) {
        // Захоўваем токен у localStorage для далейшага выкарыстання
        localStorage.setItem('token', data.token);

        alert("Вітаем, " + username + "!");
        window.location.href = '/chat'; // Напрамак на старонку чату
      } else {
        throw new Error('Не атрымалі токен ад сервера');
      }
    })
    .catch(error => {
      console.error("Памылка злучэння:", error);
      alert(error.message);
    });
});

// Праверка сесіі пры загрузцы старонкі (неабавязкова)
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  if (token) {
    alert('Вы ўжо аўтарызаваны!');
    window.location.href = '/chat'; // Аўтаматычны напрамак, калі токен ёсць
  }
});
