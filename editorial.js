document.getElementById('theme').addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
});

const textarea = document.getElementById('content');

const autoResize = (e) => {
    e.target.style.height = 'auto'; 
    e.target.style.height = `${e.target.scrollHeight}px`; 
};

textarea.addEventListener('input', autoResize);

document.getElementById('articlepage').addEventListener('click', function () {
    if (localStorage.getItem('token')) {
        window.location.href = '/article';
    }
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

 // Выбраць форму і кнопку
 const form = document.getElementById('dataForm');
 const submitBtn = document.getElementById('submitBtn');

 submitBtn.addEventListener('click', async () => {
   
     const title = document.getElementById('title').value;
     const content = document.getElementById('content').value;
     const author = document.getElementById('author').value;
     const date = document.getElementById('date').value;

     const formData = {
         title: title,
         text: content,
         author: author,
         date: date
     };

     try {
         const response = await fetch('https://vilija.onrender.com/newarticle', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(formData)
         });

         if (response.ok) {
            if (localStorage.getItem('token')) {
                window.location.href = '/article';
            }
         } else {
             alert('Адбылася памылка пры адпраўцы дадзеных.');
         }
     } catch (error) {
         alert('Адбылася памылка: ' + error.message);
     }
 });