// 1. ГЕНЕРАТОР ПАРОЛЕЙ
const lengthSlider = document.getElementById('pass-length');
const lengthVal = document.getElementById('length-val');
const genBtn = document.getElementById('gen-btn');
const passDisplay = document.getElementById('pass-display');
if(lengthSlider) {
    lengthSlider.addEventListener('input', () => { lengthVal.textContent = lengthSlider.value; });
    genBtn.addEventListener('click', () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < lengthSlider.value; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
        passDisplay.textContent = password;
    });
}

// 2. АНАЛИЗАТОР СЛОЖНОСТИ ПАРОЛЯ
const passInput = document.getElementById('password-input');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
if(passInput) {
    passInput.addEventListener('input', () => {
        const val = passInput.value; let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        if (val.length === 0) { strengthBar.style.width = '0%'; strengthText.textContent = 'Ожидание ввода данных...'; }
        else if (score <= 1) { strengthBar.style.width = '25%'; strengthBar.style.backgroundColor = '#e53e3e'; strengthText.textContent = 'Критический уровень! Взлом займет секунды.'; }
        else if (score === 2) { strengthBar.style.width = '50%'; strengthBar.style.backgroundColor = '#dd6b20'; strengthText.textContent = 'Слабая защита.'; }
        else if (score === 3) { strengthBar.style.width = '75%'; strengthBar.style.backgroundColor = '#ecc94b'; strengthText.textContent = 'Надежный пароль.'; }
        else { strengthBar.style.width = '100%'; strengthBar.style.backgroundColor = '#48bb78'; strengthText.textContent = 'Абсолютная стойкость!'; }
    });
}

// 3. БЕГУЩИЙ ЛОГ РАДАРА
const logContainer = document.getElementById('cyber-logs');
if(logContainer) {
    const attacks = ['Фишинговый пакет перехвачен', 'Скан портов заблокирован', 'Брутфорс-сессия сброшена', 'DDOS аномалия сглажена'];
    setInterval(() => {
        const line = document.createElement('div'); line.className = 'log-line';
        if (Math.random() > 0.4) { line.style.color = '#f56565'; line.textContent = `[ZONE-A] WARNING: ${attacks[Math.floor(Math.random() * attacks.length)]}`; }
        else { line.style.color = '#48bb78'; line.textContent = `[SYSTEM] Защитные экраны работают штатно.`; }
        logContainer.appendChild(line);
        if (logContainer.childNodes.length > 5) logContainer.removeChild(logContainer.firstChild);
    }, 2000);
}

// 4. ДИНАМИЧЕСКИЙ РАНДОМИЗИРОВАННЫЙ ТРЕНАЖЕР ФИШИНГА (8 сценариев)
const allPhishingQuestions = [
    { title: "Сценарий. Ссылка на банк в SMS", desc: "Какой адрес является легитимным доменом банка?", options: [{ t: "online.sberbank-id.ru", c: false }, { t: "sberbank.ru", c: true }, { t: "sber-online-login.net", c: false }] },
    { title: "Сценарий. Авторизация ВКонтакте", desc: "Вам прислали форму для авторизации в конкурсе. Какой домен безопасен?", options: [{ t: "vk.com", c: true }, { t: "://vlk.com", c: false }, { t: "vkontakte-id.ru", c: false }] },
    { title: "Сценарий. Восстановление пароля Яндекс", desc: "На какую страницу безопасно вводить пароль от Яндекс-ID?", options: [{ t: "passport-yandex.net", c: false }, { t: "yandex.ru", c: true }, { t: "yandex-verify.org", c: false }] },
    { title: "Сценарий. Официальный портал Госуслуг", desc: "Куда ведут безопасные ссылки государственных ведомств?", options: [{ t: "gosuslugi-portal.ru", c: false }, { t: "gos-uslugi.net", c: false }, { t: "gosuslugi.ru", c: true }] },
    { title: "Сценарий. Подписка Telegram Premium", desc: "Бот предлагает бесплатный Premium. Какая ссылка не украдет аккаунт?", options: [{ t: "telegram.org", c: true }, { t: "tg-premium-gift.ru", c: false }, { t: "t-me-premium.net", c: false }] },
    { title: "Сценарий. Магазин цифровых товаров", desc: "Вы покупаете игру. Какой протокол соединения обязателен в строке адреса?", options: [{ t: "https:// (шифрованный трафик)", c: true }, { t: "http:// (открытый трафик)", c: false }] },
    { title: "Сценарий. Фейковая техподдержка", desc: "Вам пришло письмо от «Администрации Почты». Какая почта отправителя настоящая?", options: [{ t: "support@mail.ru", c: true }, { t: "support-mail-security@list.ru", c: false }] },
    { title: "Сценарий. Ссылка на облачное хранилище", desc: "Вам прислали файл проекта. Какая ссылка ведет на проверенный Google Диск?", options: [{ t: "://google.com", c: true }, { t: "google-drive-shared-file.ru", c: false }] }
];

let activeQuestions = [];
let currentStep = 0; 
let correctAnswers = 0;

// Функция для выбора 5 случайных вопросов без повторений
function initializeTrainerQuestions() {
    // Копируем массив, чтобы не портить оригинал
    let pool = [...allPhishingQuestions];
    // Перемешиваем массив по алгоритму Фишера-Йетса
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // Берем первые 5 случайных уникальных вопросов
    activeQuestions = pool.slice(0, 5);
    currentStep = 0;
    correctAnswers = 0;
}

function renderPhishingStep() {
    const box = document.getElementById('trainer-content'); 
    if(!box) return;
    
    if (currentStep < activeQuestions.length) {
        const data = activeQuestions[currentStep];
        // Перемешиваем варианты ответов внутри вопроса, чтобы они тоже были в случайном порядке
        let shuffledOptions = [...data.options].sort(() => Math.random() - 0.5);
        
        let optionsHtml = shuffledOptions.map(opt => `<div class="game-option" onclick="handlePhishingAnswer(this, ${opt.c})">${opt.t}</div>`).join('');
        box.innerHTML = `<h4 style="color: #00f2fe; margin-bottom: 5px;">Шаг ${currentStep + 1} из 5. ${data.title}</h4><p style="font-size:0.9rem; color:#94a3b8; margin-bottom:15px;">${data.desc}</p>${optionsHtml}`;
    } else {
        box.innerHTML = `<h4 style="color: #48bb78; margin-bottom: 10px;">Завершено!</h4><p>Ваш результат: <strong>${correctAnswers} из 5</strong> успешно распознанных фишинг-угроз.</p><button class="cta-btn" onclick="resetPhishingTrainer()" style="width:100%; margin-top:15px; padding:10px; border:none; cursor:pointer;">Пройти заново</button>`;
    }
}

window.handlePhishingAnswer = function(element, isCorrect) {
    // Блокируем повторные клики по другим вариантам во время анимации переключения
    const options = element.parentElement.querySelectorAll('.game-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');

    if (isCorrect) { 
        element.classList.add('correct'); 
        correctAnswers++; 
    } else { 
        element.classList.add('wrong'); 
        // Подсвечиваем правильный вариант, чтобы пользователь учился на ошибках
        options.forEach(opt => {
            if(opt.getAttribute('onclick').includes('true')) opt.classList.add('correct');
        });
    }
    setTimeout(() => { currentStep++; renderPhishingStep(); }, 1500);
}

window.resetPhishingTrainer = function() { 
    initializeTrainerQuestions(); 
    renderPhishingStep(); 
}

// Запуск первой генерации при загрузке страницы сайта
initializeTrainerQuestions();
renderPhishingStep();

// 5. ЧЕК-ЛИСТ БЕЗОПАСНОСТИ
const checkboxes = document.querySelectorAll('.check-secure');
const percentDisplay = document.getElementById('secure-percent');
checkboxes.forEach(box => {
    box.addEventListener('change', () => {
        let count = document.querySelectorAll('.check-secure:checked').length;
        percentDisplay.textContent = Math.round((count / checkboxes.length) * 100);
    });
});

// 6. СИМУЛЯТОР ВЗЛОМА (ИНЪЕКЦИЯ КОДА)
const hackBtn = document.getElementById('simulate-hack-btn');
const hackOverlay = document.getElementById('hack-overlay');
const hackStatus = document.getElementById('hack-status');
const hackConsole = document.getElementById('hack-console');
if(hackBtn) {
    hackBtn.addEventListener('click', () => {
        hackOverlay.classList.add('active'); hackConsole.innerHTML = '';
        hackStatus.textContent = "⚠️ ОБНАРУЖЕНА КИБЕРАТАКА..."; hackStatus.style.color = "#f56565";
        let logs = [
            "Connecting to malicious payload source...", 
            "WARNING: SQL-INJECTION ATTEMPT DETECTED BY PYTHON INTERCEPTOR", 
            "ACTIVATING FIREWALL SANDBOX ENVIRONMENT...",
            "BLOCKING MALICIOUS IP ROUTE... DONE",
            "INTEGRITY STATUS: SECURE."
        ];
        let i = 0;
        let interval = setInterval(() => {
            if (i < logs.length) {
                const p = document.createElement('p'); p.textContent = `> ${logs[i]}`; 
                p.style.color = (i===0 || i===1) ? "#f56565" : "#48bb78";
                hackConsole.appendChild(p); i++;
            } else { 
                clearInterval(interval); 
                hackStatus.textContent = "🛡️ АТАКА ОТРАЖЕНА СЕРВЕРОМ FLASK!"; 
                hackStatus.style.color = "#48bb78"; 
                setTimeout(() => { hackOverlay.classList.remove('active'); }, 1800); 
            }
        }, 500);
    });
}

// 7. ПЕРЕКЛЮЧЕНИЕ ИНФОРМАЦИОННЫХ ВКЛАДОК
window.openTab = function(evt, tabId) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) tabContents[i].classList.remove("active");
    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) tabButtons[i].classList.remove("active");
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
}
