const modeToggle = document.getElementById('mode-toggle');
const modeIcon = document.getElementById('mode-icon');
const body = document.body;

// Load mode from localStorage
if (localStorage.getItem('mode') === 'light') {
    body.classList.add('light-mode');
    modeIcon.textContent = '🌞';
}

modeToggle.onclick = () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        modeIcon.textContent = '🌞';
        localStorage.setItem('mode', 'light');
    } else {
        modeIcon.textContent = '🌙';
        localStorage.setItem('mode', 'dark');
    }
};

// Optional: Prevent form submission for demo
document.querySelector('.register-form').onsubmit = e => {
    e.preventDefault();
    alert('Registration submitted! (Demo)');
};