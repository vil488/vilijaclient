// DOM Elements
const articlesContainer = document.getElementById("articles");
const articleList = document.querySelector(".article-list");

// Функцыя для запыту артыкулаў з бэкенда
async function fetchArticles() {
    try {
        const response = await fetch('https://vilija.onrender.com/articles'); // Адрас вашага бэкенда
        if (!response.ok) {
            throw new Error('Не атрымалася загрузіць артыкулы');
        }

        const articles = await response.json();
        displayArticles(articles); // Перадаем атрыманыя артыкулы ў функцыю для адлюстравання
    } catch (error) {
        console.error('Error fetching articles:', error);
        articlesContainer.innerHTML = '<p>Не атрымалася загрузіць артыкулы.</p>';
    }
}


function getUserRole() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1])); // Дэкадаванне payload з JWT
    return payload.role; // Вяртаем ролю
}


function renderButtons() {
    const role = getUserRole();
    if (role === 'admin') {
        document.getElementById('edit').style.display = 'block';
    } else {
        document.getElementById('edit').style.display = 'none';
    }
}









const editBut = document.getElementById('edit').addEventListener('click', async () => {
    try {
        // Запыт да сервера для праверкі ролі
        const response = await fetch('https://vilija.onrender.com/check-admin', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Токен з localStorage
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.isAdmin) {
                // Калі карыстальнік адмін, пераходзім на старонку
                window.location.href = '/editorial';
            } else {
                alert('Вы не маеце доступу да гэтай старонкі.');
            }
        } else {
            alert('Не ўдалося праверыць правы доступу.');
        }
    } catch (error) {
        console.error(error);
        alert('Не атрымалася праверыць правы доступу.');
    }
});



// Функцыя для адлюстравання спісу артыкулаў
function displayArticles(articles) {
    if (articles.length > 1) {
        const firstArticle = articles.shift(); // Вымаем першы элемент
        articles.splice(1, 0, firstArticle); // Устаўляем яго на другое месца
    }

    articlesContainer.innerHTML = ""; // Ачысціць кантэйнер перад запаўненнем

    articles.forEach((article) => {
        const articleItem = document.createElement("div");
        articleItem.classList.add("article-list-item");
        articleItem.textContent = article.title;
        articleItem.onclick = () => openArticle(article); // Пры кліку адлюстроўваем поўны артыкул
        articlesContainer.appendChild(articleItem);
    });
}


// Функцыя для адлюстравання поўнага артыкула
function openArticle(article) {
    // Ачысціць спіс і паказаць поўны артыкул
    articlesContainer.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.content}</p>
        <div class="autar">Аўтар: <span>${article.author}</span></div>
        <div class="artickeldata">Дата: <span>${article.date}</span></div>
        <button class="close-article" onclick="closeArticle()">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="XMLID_64_" viewBox="0 0 24 24" xml:space="preserve">
                <g id="link-previous">
                    <g>
                        <polygon points="10.3,20.7 1.6,12 10.3,3.3 11.7,4.7 5.5,11 22,11 22,13 5.5,13 11.7,19.3"/>
                    </g>
                </g>
            </svg>
        </button>



    `;
}

// Функцыя для вяртання да спісу артыкулаў
async function closeArticle() {
    await fetchArticles(); // Зноў атрымаць спіс артыкулаў
}


document.getElementById('theme').addEventListener('click', function () {
    // Змяняем клас тэмы ў body
    document.body.classList.toggle('light-theme');

    // Захоўваем стан тэмы ў LocalStorage
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
});

// Пераключэнне тэмы (цёмная/светлая)
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
});


// Пераход на старонку "чат"
document.getElementById('info').addEventListener('click', function() {
    window.location.href = '/chat'; // Змяніце шлях на адпаведны
});

document.getElementById('logout').addEventListener('click', function logout() {
    // Выдаляем токен з localStorage
    localStorage.removeItem('token');
    // Перанакіроўваем на старонку лагіна
    window.location.href = 'index.html';
}
)

document.addEventListener("DOMContentLoaded", function() {
    fetchArticles();
    renderButtons();
});
