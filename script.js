/* ==========================================
   ИНИЦИАЛИЗАЦИЯ И ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активные классы
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => {
                p.classList.remove('active-panel');
                p.style.animation = 'none'; // Сброс анимации для повторного запуска
            });

            // Ставим активный класс на нажатую кнопку и панель
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.target);
            
            // Принудительный reflow для перезапуска CSS-анимации
            void target.offsetWidth; 
            target.classList.add('active-panel');
        });
    });

    initCalculator();
    initIndicator();
    initTitleGenerator();
});

/* ==========================================
   1. ЛОГИКА КАЛЬКУЛЯТОРА
   ========================================== */
function initCalculator() {
    const num1 = document.getElementById('num1');
    const num2 = document.getElementById('num2');
    const keypad = document.querySelectorAll('.calc-keypad button[data-val]');
    const clearBtn = document.getElementById('clear-key');
    const calcBtn = document.getElementById('calc-btn');
    const operator = document.getElementById('operator');
    const resultDisplay = document.getElementById('result-display');

    let activeInput = num1; // По умолчанию активно первое поле

    // Переключение активного поля ввода при клике
    [num1, num2].forEach(inp => {
        inp.addEventListener('click', () => {
            activeInput = inp;
            document.querySelectorAll('.calc-input').forEach(i => i.classList.remove('active-input'));
            inp.classList.add('active-input');
        });
    });

    // Ввод цифр с клавиатуры
    keypad.forEach(btn => {
        btn.addEventListener('click', () => {
            activeInput.value += btn.dataset.val;
        });
    });

    // Очистка активного поля
    clearBtn.addEventListener('click', () => {
        activeInput.value = '';
        resultDisplay.textContent = '—';
        resultDisplay.classList.remove('red');
    });

    // Вычисление
    calcBtn.addEventListener('click', () => {
        const n1 = parseFloat(num1.value);
        const n2 = parseFloat(num2.value);
        const op = operator.value;

        if (isNaN(n1) || isNaN(n2)) {
            resultDisplay.textContent = 'Введите числа';
            return;
        }

        let res;
        switch (op) {
            case '+': res = n1 + n2; break;
            case '-': res = n1 - n2; break;
            case '*': res = n1 * n2; break;
            case '/': res = n2 !== 0 ? n1 / n2 : 'Деление на 0'; break;
        }

        // Округление до 2 знаков для красоты
        if (typeof res === 'number') res = Math.round(res * 100) / 100;

        resultDisplay.textContent = res;
        
        // Логика > 15
        if (typeof res === 'number' && res > 15) {
            resultDisplay.textContent = 'число>15';
            resultDisplay.classList.add('red');
        } else {
            resultDisplay.classList.remove('red');
        }
    });
}

/* ==========================================
   2. ЛОГИКА ИНДИКАТОРА
   ========================================== */
function initIndicator() {
    const range = document.getElementById('range-slider');
    const rangeText = document.getElementById('range-val-text');
    const keypad = document.querySelectorAll('.indicator-keypad button[data-ind]');
    const setBtn = document.getElementById('set-ind-btn');
    const container = document.getElementById('range-container');

    let inputValue = '';

    // Ввод цифр
    keypad.forEach(btn => {
        btn.addEventListener('click', () => {
            inputValue += btn.dataset.ind;
        });
    });

    // Установка значения
    setBtn.addEventListener('click', () => {
        const val = parseInt(inputValue) || 0;
        const finalVal = Math.min(Math.max(val, 0), 10); // Ограничение 0-10

        range.value = finalVal;
        rangeText.textContent = finalVal;

        // Визуальная индикация > 5
        if (finalVal > 5) {
            container.classList.add('alert-active');
            document.body.style.background = 'radial-gradient(circle at top right, #7f1d1d, #1c1917)';
        } else {
            container.classList.remove('alert-active');
            document.body.style.background = '';
        }

        inputValue = ''; // Сброс накопленного ввода
    });

    // Обновление текста при ручном перетаскивании
    range.addEventListener('input', () => {
        rangeText.textContent = range.value;
        if (parseInt(range.value) > 5) {
            container.classList.add('alert-active');
        } else {
            container.classList.remove('alert-active');
        }
    });
}

/* ==========================================
   3. ГЕНЕРАТОР ТИТУЛЬНОГО ЛИСТА
   ========================================== */
function initTitleGenerator() {
    const form = document.getElementById('title-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Сбор данных из формы
        const data = {
            dept: document.getElementById('dept').value.trim(),
            group: document.getElementById('grp').value.trim(),
            student: document.getElementById('student').value.trim(),
            teacher: document.getElementById('teacher').value.trim()
        };

        // Формирование HTML-строки титульного листа (по образцу из БЗ)
        const titleHTML = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Титульный лист | ЛР №1</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 0; padding: 60px 80px; background: #fff; color: #000; }
        .center { text-align: center; }
        .header { margin-bottom: 50px; line-height: 1.6; font-size: 14px; }
        .title { font-size: 22px; font-weight: bold; margin: 40px 0; }
        .info-block { margin-top: 80px; font-size: 14px; }
        .row { display: flex; justify-content: space-between; margin: 15px 0; border-bottom: 1px solid #000; padding-bottom: 5px; }
        .footer { margin-top: 120px; font-size: 14px; }
        .back-btn { margin-top: 40px; padding: 10px 20px; font-size: 16px; cursor: pointer; border: 1px solid #333; background: #f0f0f0; border-radius: 4px; }
        .back-btn:hover { background: #ddd; }
    </style>
</head>
<body>
    <div class="header center">
        МИНОБРНАУКИ РОССИИ<br>
        ФГАОУ ВО «МГТУ «СТАНКИН»<br>
        ${data.dept}<br>
        Дисциплина «Основы системного программного обеспечения»
    </div>

    <div class="title center">ОТЧЕТ ПО ЛАБОРАТОРНОЙ РАБОТЕ № 1</div>

    <div class="info-block">
        <div class="row"><span>Выполнил студент гр. ${data.group}:</span> <span>${data.student}</span></div>
        <div class="row"><span>Проверил:</span> <span>${data.teacher}</span></div>
        <div style="margin-top: 10px; font-size: 12px; color: #555;">
            (дата) _____________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (подпись) _____________
        </div>
    </div>

    <div class="footer center">Москва 2026 г.</div>

    <button class="back-btn center" onclick="history.back()">← Вернуться к генератору</button>
</body>
</html>`;

        // Создание Blob-объекта и имитация редиректа на новую страницу
        const blob = new Blob([titleHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.location.href = url; // Редирект на сгенерированный документ
    });
}
