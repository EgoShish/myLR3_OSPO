/* ============================================
   ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
   ============================================ */

/** Текущий шаг анкетирования (1-5) */
let currentStep = 1;
const totalSteps = 5;

/* ============================================
   АНКЕТИРОВАНИЕ — УПРАВЛЕНИЕ ШАГАМИ
   ============================================ */

/**
 * Переключение на следующий шаг анкеты
 * Обновляет прогресс-бар и видимость шагов
 */
function nextStep() {
    if (currentStep < totalSteps) {
        // Скрываем текущий шаг
        document.querySelector(`.survey-step[data-step="${currentStep}"]`)
            .classList.remove('active');

        currentStep++;

        // Показываем следующий шаг
        document.querySelector(`.survey-step[data-step="${currentStep}"]`)
            .classList.add('active');

        updateProgressBar();
    }
}

/**
 * Возврат на предыдущий шаг анкеты
 */
function prevStep() {
    if (currentStep > 1) {
        document.querySelector(`.survey-step[data-step="${currentStep}"]`)
            .classList.remove('active');

        currentStep--;

        document.querySelector(`.survey-step[data-step="${currentStep}"]`)
            .classList.add('active');

        updateProgressBar();
    }
}

/**
 * Обновление прогресс-бара анкеты
 */
function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('surveyProgressBar').style.width = progress + '%';
    document.getElementById('surveyStepCount').textContent =
        `Шаг ${currentStep} из ${totalSteps}`;
}

/* ============================================
   АНКЕТИРОВАНИЕ — ДИНАМИЧЕСКИЕ ПОЛЯ
   ============================================ */

/**
 * Добавление нового блока записи (опыт или образование)
 * @param {string} type - 'exp' для опыта, 'edu' для образования
 */
function addEntry(type) {
    const container = type === 'exp'
        ? document.getElementById('experienceEntries')
        : document.getElementById('educationEntries');

    // Создаём новый блок
    const block = document.createElement('div');
    block.className = 'entry-block';
    block.dataset.entry = type;

    if (type === 'exp') {
        block.innerHTML = `
            <button class="entry-remove" onclick="removeEntry(this)" title="Удалить">✕</button>
            <div class="survey-field">
                <label>Должность</label>
                <input type="text" class="exp-position" placeholder="Developer">
            </div>
            <div class="survey-field">
                <label>Компания</label>
                <input type="text" class="exp-company" placeholder="Company">
            </div>
            <div class="survey-field">
                <label>Период</label>
                <input type="text" class="exp-period" placeholder="2020 — 2023">
            </div>
            <div class="survey-field">
                <label>Описание обязанностей</label>
                <textarea class="exp-desc" rows="2" placeholder="Разработка..."></textarea>
            </div>
        `;
    } else {
        block.innerHTML = `
            <button class="entry-remove" onclick="removeEntry(this)" title="Удалить">✕</button>
            <div class="survey-field">
                <label>Учебное заведение / Курс</label>
                <input type="text" class="edu-school" placeholder="Университет">
            </div>
            <div class="survey-field">
                <label>Специальность</label>
                <input type="text" class="edu-degree" placeholder="Специальность">
            </div>
            <div class="survey-field">
                <label>Годы обучения</label>
                <input type="text" class="edu-years" placeholder="2015 — 2019">
            </div>
        `;
    }

    container.appendChild(block);

    // Плавная прокрутка к новому блоку
    block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Удаление блока записи
 * @param {HTMLElement} btn - кнопка удаления
 */
function removeEntry(btn) {
    const block = btn.closest('.entry-block');
    block.style.animation = 'fadeInUp 0.2s ease reverse';
    setTimeout(() => block.remove(), 200);
}

/* ============================================
   АНКЕТИРОВАНИЕ — ЗАВЕРШЕНИЕ И СОХРАНЕНИЕ
   ============================================ */

/**
 * Сбор данных из анкеты и отображение резюме
 */
function finishSurvey() {
    // Собираем все данные из полей анкеты
    const data = collectSurveyData();

    // Сохраняем в localStorage
    localStorage.setItem('resumeData', JSON.stringify(data));

    // Рендерим резюме на странице
    renderResume(data);

    // Скрываем анкету
    document.getElementById('surveyOverlay').classList.add('hidden');

    // Показываем кнопку редактирования
    document.getElementById('editBtn').style.display = 'flex';
}

/**
 * Сбор данных из всех полей анкеты
 * @returns {Object} объект с данными резюме
 */
function collectSurveyData() {
    // Основная информация
    const data = {
        name: document.getElementById('surveyName').value.trim() || 'Ваше Имя',
        title: document.getElementById('surveyTitle').value.trim() || 'Ваша должность',
        summary: document.getElementById('surveySummary').value.trim() || '',
        avatar: document.getElementById('surveyAvatar').value.trim() || '',

        // Опыт работы — собираем все блоки
        experience: [],
    };

    // Собираем опыт работы
    document.querySelectorAll('#experienceEntries .entry-block').forEach(block => {
        const position = block.querySelector('.exp-position').value.trim();
        const company = block.querySelector('.exp-company').value.trim();
        const period = block.querySelector('.exp-period').value.trim();
        const desc = block.querySelector('.exp-desc').value.trim();

        if (position || company) {
            data.experience.push({ position, company, period, desc });
        }
    });

    // Образование
    data.education = [];
    document.querySelectorAll('#educationEntries .entry-block').forEach(block => {
        const school = block.querySelector('.edu-school').value.trim();
        const degree = block.querySelector('.edu-degree').value.trim();
        const years = block.querySelector('.edu-years').value.trim();

        if (school || degree) {
            data.education.push({ school, degree, years });
        }
    });

    // Навыки — разбираем строки через запятую
    const techRaw = document.getElementById('surveyTechSkills').value.trim();
    const softRaw = document.getElementById('surveySoftSkills').value.trim();

    data.techSkills = techRaw
        ? techRaw.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    data.softSkills = softRaw
        ? softRaw.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    // Контакты
    data.email = document.getElementById('surveyEmail').value.trim() || '';
    data.phone = document.getElementById('surveyPhone').value.trim() || '';
    data.location = document.getElementById('surveyLocation').value.trim() || '';
    data.link = document.getElementById('surveyLinkedIn').value.trim() || '';

    return data;
}

/* ============================================
   РЕНДЕРИНГ РЕЗЮМЕ НА СТРАНИЦЕ
   ============================================ */

/**
 * Отображение данных резюме в соответствующих секциях
 * @param {Object} data — данные резюме
 */
function renderResume(data) {
    // --- Hero-секция ---
    const nameEl = document.getElementById('heroName');
    const titleEl = document.getElementById('heroTitle');
    const summaryEl = document.getElementById('heroSummary');
    const avatarEl = document.getElementById('heroAvatar');

    nameEl.textContent = data.name;
    titleEl.textContent = data.title;
    summaryEl.textContent = data.summary || 'Заполните информацию о себе';

    // Аватар (если указан URL)
    if (data.avatar) {
        avatarEl.innerHTML = `<img src="${data.avatar}" alt="${data.name}">`;
    } else {
        avatarEl.innerHTML = '<span class="avatar-placeholder">👤</span>';
    }

    // Обновляем логотип в навигации
    document.getElementById('navLogo').textContent = data.name.split(' ')[0];

    // Контактная информация в hero
    const heroContactInfo = document.getElementById('heroContactInfo');
    let heroContactHTML = '';

    if (data.email) {
        heroContactHTML += `
            <span class="hero-contact-item">
                <span class="icon">📧</span> ${data.email}
            </span>`;
    }
    if (data.phone) {
        heroContactHTML += `
            <span class="hero-contact-item">
                <span class="icon">📱</span> ${data.phone}
            </span>`;
    }
    if (data.location) {
        heroContactHTML += `
            <span class="hero-contact-item">
                <span class="icon">📍</span> ${data.location}
            </span>`;
    }
    heroContactInfo.innerHTML = heroContactHTML;

    // --- Опыт работы ---
    const timeline = document.getElementById('experienceTimeline');

    if (data.experience.length > 0) {
        timeline.innerHTML = data.experience.map((exp, i) => `
            <div class="timeline-item animate-on-scroll">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h3 class="timeline-position">${escapeHtml(exp.position)}</h3>
                    <p class="timeline-company">${escapeHtml(exp.company)}</p>
                    <p class="timeline-period">${escapeHtml(exp.period)}</p>
                    <p class="timeline-desc">${escapeHtml(exp.desc)}</p>
                </div>
            </div>
        `).join('');
    }

    // --- Образование ---
    const eduGrid = document.getElementById('educationGrid');

    if (data.education.length > 0) {
        eduGrid.innerHTML = data.education.map((edu) => `
            <div class="card animate-on-scroll">
                <div class="card-icon">🏛️</div>
                <h3 class="card-title">${escapeHtml(edu.school)}</h3>
                <p class="card-subtitle">${escapeHtml(edu.degree)}</p>
                <p class="card-years">${escapeHtml(edu.years)}</p>
            </div>
        `).join('');
    }

    // --- Навыки ---
    const techList = document.getElementById('techSkillsList');
    const softList = document.getElementById('softSkillsList');

    if (data.techSkills.length > 0) {
        techList.innerHTML = data.techSkills.map(skill =>
            `<span class="skill-tag">${escapeHtml(skill)}</span>`
        ).join('');
    }

    if (data.softSkills.length > 0) {
        softList.innerHTML = data.softSkills.map(skill =>
            `<span class="skill-tag">${escapeHtml(skill)}</span>`
        ).join('');
    }

    // --- Контакты в нижней секции ---
    document.getElementById('contactEmail').textContent = data.email || '—';
    document.getElementById('contactPhone').textContent = data.phone || '—';
    document.getElementById('contactLocation').textContent = data.location || '—';
    document.getElementById('contactLink').textContent = data.link || '—';

    // Скрываем пустые элементы контактов
    toggleContactItem('contactEmailItem', data.email);
    toggleContactItem('contactPhoneItem', data.phone);
    toggleContactItem('contactLocationItem', data.location);
    toggleContactItem('contactLinkItem', data.link);

    // --- Футер ---
    document.getElementById('footerText').textContent =
        `© ${new Date().getFullYear()} ${data.name} — Все права защищены`;

    // Перезапускаем анимации скролла для новых элементов
    initScrollAnimations();
}

/**
 * Переключение видимости элемента контакта
 */
function toggleContactItem(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = value ? 'flex' : 'none';
    }
}

/**
 * Экранирование HTML для безопасности (защита от XSS)
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ============================================
   ЗАГРУЗКА СОХРАНЁННЫХ ДАННЫХ
   ============================================ */

/**
 * При загрузке страницы проверяем, есть ли сохранённые данные
 * Если есть — сразу рендерим резюме без анкеты
 */
function loadSavedData() {
    const saved = localStorage.getItem('resumeData');

    if (saved) {
        try {
            const data = JSON.parse(saved);
            renderResume(data);
            // Скрываем анкету
            document.getElementById('surveyOverlay').classList.add('hidden');
            // Показываем кнопку редактирования
            document.getElementById('editBtn').style.display = 'flex';
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
            localStorage.removeItem('resumeData');
        }
    }
}

/* ============================================
   КНОПКА РЕДАКТИРОВАНИЯ
   ============================================ */

document.getElementById('editBtn').addEventListener('click', () => {
    // Загружаем сохранённые данные обратно в поля анкеты
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        const data = JSON.parse(saved);
        populateSurveyFields(data);
    }

    // Показываем анкету с первого шага
    currentStep = 1;
    document.querySelectorAll('.survey-step').forEach(step => step.classList.remove('active'));
    document.querySelector('.survey-step[data-step="1"]').classList.add('active');
    updateProgressBar();

    document.getElementById('surveyOverlay').classList.remove('hidden');
});

/**
 * Заполнение полей анкеты из сохранённых данных
 */
function populateSurveyFields(data) {
    document.getElementById('surveyName').value = data.name || '';
    document.getElementById('surveyTitle').value = data.title || '';
    document.getElementById('surveySummary').value = data.summary || '';
    document.getElementById('surveyAvatar').value = data.avatar || '';

    // Опыт работы
    const expContainer = document.getElementById('experienceEntries');
    expContainer.innerHTML = '';
    data.experience.forEach(exp => {
        const block = document.createElement('div');
        block.className = 'entry-block';
        block.dataset.entry = 'exp';
        block.innerHTML = `
            <button class="entry-remove" onclick="removeEntry(this)" title="Удалить">✕</button>
            <div class="survey-field">
                <label>Должность</label>
                <input type="text" class="exp-position" value="${escapeHtml(exp.position)}" placeholder="Developer">
            </div>
            <div class="survey-field">
                <label>Компания</label>
                <input type="text" class="exp-company" value="${escapeHtml(exp.company)}" placeholder="Company">
            </div>
            <div class="survey-field">
                <label>Период</label>
                <input type="text" class="exp-period" value="${escapeHtml(exp.period)}" placeholder="2020 — 2023">
            </div>
            <div class="survey-field">
                <label>Описание обязанностей</label>
                <textarea class="exp-desc" rows="2" placeholder="Разработка...">${escapeHtml(exp.desc)}</textarea>
            </div>
        `;
        expContainer.appendChild(block);
    });

    // Образование
    const eduContainer = document.getElementById('educationEntries');
    eduContainer.innerHTML = '';
    data.education.forEach(edu => {
        const block = document.createElement('div');
        block.className = 'entry-block';
        block.dataset.entry = 'edu';
        block.innerHTML = `
            <button class="entry-remove" onclick="removeEntry(this)" title="Удалить">✕</button>
            <div class="survey-field">
                <label>Учебное заведение / Курс</label>
                <input type="text" class="edu-school" value="${escapeHtml(edu.school)}" placeholder="Университет">
            </div>
            <div class="survey-field">
                <label>Специальность</label>
                <input type="text" class="edu-degree" value="${escapeHtml(edu.degree)}" placeholder="Специальность">
            </div>
            <div class="survey-field">
                <label>Годы обучения</label>
                <input type="text" class="edu-years" value="${escapeHtml(edu.years)}" placeholder="2015 — 2019">
            </div>
        `;
        eduContainer.appendChild(block);
    });

    // Навыки
    document.getElementById('surveyTechSkills').value =
        (data.techSkills || []).join(', ');
    document.getElementById('surveySoftSkills').value =
        (data.softSkills || []).join(', ');

    // Контакты
    document.getElementById('surveyEmail').value = data.email || '';
    document.getElementById('surveyPhone').value = data.phone || '';
    document.getElementById('surveyLocation').value = data.location || '';
    document.getElementById('surveyLinkedIn').value = data.link || '';
}

/* ============================================
   КНОПКА "СКАЧАТЬ РЕЗЮМЕ" (заглушка)
   ============================================ */

function handleDownload(event) {
    event.preventDefault();

    // Собираем данные для генерации текстового резюме
    const saved = localStorage.getItem('resumeData');
    if (!saved) {
        alert('Сначала заполните анкету!');
        return;
    }

    const data = JSON.parse(saved);

    // Генерируем простой текстовый файл резюме
    let text = `${data.name}\n`;
    text += `${data.title}\n`;
    text += `${'═'.repeat(40)}\n\n`;
    text += `О СЕБЕ\n${data.summary}\n\n`;

    if (data.experience.length) {
        text += `ОПЫТ РАБОТЫ\n${'─'.repeat(40)}\n`;
        data.experience.forEach(exp => {
            text += `\n▸ ${exp.position} | ${exp.company}\n`;
            text += `  Период: ${exp.period}\n`;
            text += `  ${exp.desc}\n`;
        });
    }

    if (data.education.length) {
        text += `\nОБРАЗОВАНИЕ\n${'─'.repeat(40)}\n`;
        data.education.forEach(edu => {
            text += `\n▸ ${edu.school}\n`;
            text += `  ${edu.degree} (${edu.years})\n`;
        });
    }

    if (data.techSkills.length || data.softSkills.length) {
        text += `\nНАВЫКИ\n${'─'.repeat(40)}\n`;
        if (data.techSkills.length) {
            text += `Технические: ${data.techSkills.join(', ')}\n`;
        }
        if (data.softSkills.length) {
            text += `Soft Skills: ${data.softSkills.join(', ')}\n`;
        }
    }

    if (data.email || data.phone) {
        text += `\nКОНТАКТЫ\n${'─'.repeat(40)}\n`;
        if (data.email) text += `Email: ${data.email}\n`;
        if (data.phone) text += `Телефон: ${data.phone}\n`;
        if (data.location) text += `Город: ${data.location}\n`;
        if (data.link) text += `Профиль: ${data.link}\n`;
    }

    // Создаём и скачиваем файл
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* ============================================
   ПЛАВНЫЙ СКРОЛЛ К КОНТАКТНОЙ ФОРМЕ
   ============================================ */

document.getElementById('contactBtn').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    // Закрываем мобильное меню если открыто
    document.getElementById('navLinks').classList.remove('open');
});

/* ============================================
   ВАЛИДАЦИЯ ФОРМЫ ОБРАТНОЙ СВЯЗИ
   ============================================ */

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Сбрасываем предыдущие ошибки
    clearFormErrors();

    // Получаем значения полей
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    let isValid = true;

    // Валидация имени (минимум 2 символа)
    if (name.length < 2) {
        showFieldError('formName', 'formNameError', 'Имя должно содержать минимум 2 символа');
        isValid = false;
    }

    // Валидация email (регулярное выражение)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('formEmail', 'formEmailError', 'Введите корректный email');
        isValid = false;
    }

    // Валидация сообщения (минимум 10 символов)
    if (message.length < 10) {
        showFieldError('formMessage', 'formMessageError', 'Сообщение должно содержать минимум 10 символов');
        isValid = false;
    }

    // Если всё валидно — "отправляем" форму
    if (isValid) {
        const submitBtn = document.getElementById('formSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Отправка...';

        // Имитация задержки отправки
        setTimeout(() => {
            // Показываем сообщение об успехе
            document.getElementById('formSuccess').style.display = 'block';

            // Очищаем форму
            this.reset();

            // Возвращаем кнопку в исходное состояние
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Отправить сообщение';

            // Скрываем сообщение об успехе через 4 секунды
            setTimeout(() => {
                document.getElementById('formSuccess').style.display = 'none';
            }, 4000);
        }, 1200);
    }
});

/**
 * Показать ошибку для конкретного поля
 */
function showFieldError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add('error');
    document.getElementById(errorId).textContent = message;
}

/**
 * Очистить все ошибки формы
 */
function clearFormErrors() {
    // Убираем класс error у всех полей
    document.querySelectorAll('.contact-form input, .contact-form textarea')
        .forEach(el => el.classList.remove('error'));

    // Очищаем текст ошибок
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

    // Скрываем сообщение об успехе
    document.getElementById('formSuccess').style.display = 'none';
}

// Убираем ошибку при вводе
document.querySelectorAll('.contact-form input, .contact-form textarea')
    .forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('error');
            // Находим span с ошибкой рядом
            const errorSpan = this.parentElement.querySelector('.form-error');
            if (errorSpan) errorSpan.textContent = '';
        });
    });

/* ============================================
   АНИМАЦИИ ПРИ СКРОЛЛЕ (Intersection Observer)
   ============================================ */

function initScrollAnimations() {
    // Создаём наблюдатель — элемент должен появиться на 15% в области видимости
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    // Наблюдаем за всеми элементами с классом animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   НАВИГАЦИЯ
   ============================================ */

// Бургер-меню для мобильных устройств
document.getElementById('navToggle').addEventListener('click', function () {
    document.getElementById('navLinks').classList.toggle('open');

    // Анимация иконки бургера
    this.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

// Эффект навигации при скролле
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Подсветка активного пункта меню
    updateActiveNavLink();
});

/**
 * Подсветка текущей секции в навигации
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Загружаем сохранённые данные (если есть)
    loadSavedData();

    // Инициализируем анимации скролла
    initScrollAnimations();

    // Обновляем прогресс-бар анкеты
    updateProgressBar();
});
