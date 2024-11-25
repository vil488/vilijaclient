// DOM Elements
const articlesContainer = document.getElementById("articles");
const articleList = document.querySelector(".article-list");

// Функцыя для запыту артыкулаў з бэкенда
async function fetchArticles() {
    try {
        const response = await fetch('http://localhost:3000/articles'); // Адрас вашага бэкенда
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

// Функцыя для адлюстравання спісу артыкулаў
function displayArticles(articles) {
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
        <p>${article.text}</p>
        <div class="autar">Аўтар: <span>${article.author}</span></div>
        <div class="artickeldata">Дата: <span>${article.date}</span></div>
        <button class="close-article" onclick="closeArticle()">Close</button>
    `;
}

// Функцыя для вяртання да спісу артыкулаў
async function closeArticle() {
    await fetchArticles(); // Зноў атрымаць спіс артыкулаў
}

// Пераключэнне тэмы (цёмная/светлая)
document.getElementById('theme').addEventListener('click', function toggleTheme() {
    document.body.classList.toggle("light-theme");
});

// Пераход на старонку "чат"
document.getElementById('info').addEventListener('click', function() {
    window.location.href = '/chat'; // Змяніце шлях на адпаведны
});

// Ініцыялізацыя: загрузіць спіс артыкулаў пры старце
document.addEventListener("DOMContentLoaded", fetchArticles);
