// Ждем загрузки DOM дерева
document.addEventListener("DOMContentLoaded", () => {

    // --- ЭЛЕМЕНТЫ РЕЗЮМЕ ---
    const changeNameBtn = document.getElementById("changeNameBtn");
    const lastNameInput = document.getElementById("lastNameInput");
    const userLastName = document.getElementById("userLastName");
    const userFirstName = document.getElementById("userFirstName");

    // --- ЭЛЕМЕНТЫ АНКЕТЫ ---
    const startSurveyBtn = document.getElementById("startSurveyBtn");
    const surveyForm = document.getElementById("surveyForm");
    const submitSurveyBtn = document.getElementById("submitSurveyBtn");
    const surveyResult = document.getElementById("surveyResult");
    
    // Чекбоксы и текстовое поле
    const skillMath = document.getElementById("skillMath");
    const skillProg = document.getElementById("skillProg");
    const extraInfo = document.getElementById("extraInfo");

    // Глобальные переменные для хранения данных пользователя
    let userName = "";
    let userAge = 0;
    let userGender = "";

    // --- ЛОГИКА РЕЗЮМЕ (изменение фамилии) ---
    changeNameBtn.addEventListener("click", () => {
        const newName = lastNameInput.value.trim();
        if (newName !== "") {
            userLastName.innerText = newName;
            lastNameInput.value = "";
        } else {
            alert("Пожалуйста, введите фамилию в поле!");
        }
    });

    // --- ЗАПУСК АНКЕТЫ ---
    startSurveyBtn.addEventListener("click", () => {
        // Пункт 2: Проверка имени (только буквы)
        while (true) {
            userName = prompt("Введите ваше имя (только буквы):", "Иван");
            if (userName === null) return; // Отмена
            if (/^[a-zA-Zа-яА-ЯёЁ]+$/.test(userName.trim())) {
                userName = userName.trim();
                break;
            }
            alert("Имя должно содержать только буквы!");
        }

        // Пункт 2: Проверка возраста (целое неотрицательное число)
        while (true) {
            let ageInput = prompt("Введите ваш возраст:", "25");
            if (ageInput === null) return;
            let age = parseInt(ageInput);
            if (!isNaN(age) && age >= 0 && Number.isInteger(age)) {
                userAge = age;
                break;
            }
            alert("Возраст должен быть целым неотрицательным числом!");
        }

        // Пункт 2: Проверка пола (только М или Ж)
        while (true) {
            userGender = prompt("Введите ваш пол (М или Ж):", "М");
            if (userGender === null) return;
            userGender = userGender.trim().toUpperCase();
            if (userGender === "М" || userGender === "Ж") {
                break;
            }
            alert("Пол должен быть только 'М' или 'Ж'!");
        }

        // Обновляем имя в резюме
        userFirstName.innerText = userName;

        // Пункт 5: Скрываем кнопку "Заполнить анкету"
        startSurveyBtn.style.display = "none";
        
        // Показываем форму с чекбоксами
        surveyForm.style.display = "block";
    });

    // --- ОБРАБОТКА НАЖАТИЯ "МЕНЯ ВОЗЬМУТ" ---
    submitSurveyBtn.addEventListener("click", () => {
        // Пункт 4: Запрет изменения чекбоксов после отправки
        skillMath.disabled = true;
        skillProg.disabled = true;
        extraInfo.disabled = true;
        submitSurveyBtn.disabled = true;

        // Пункт 6: Вызов функции check()
        const isHired = check();
        
        // Пункт 3: Показываем скрытый ранее результат
        surveyResult.style.display = "block";
        
        if (isHired) {
            surveyResult.innerHTML = `<p style="color: green; font-weight: bold;">Поздравляем, ${userName}! Вы приняты!</p>`;
        } else {
            surveyResult.innerHTML = `<p style="color: red; font-weight: bold;">К сожалению, ${userName}, вы не прошли отбор.</p>`;
        }

        // Дополнительно выводим таблицу с данными
        surveyForm.insertAdjacentHTML('afterend', `
            <table class="user-table" style="margin-top: 15px;">
                <tr><td><strong>Имя</strong></td><td>${userName}</td></tr>
                <tr><td><strong>Возраст</strong></td><td>${userAge}</td></tr>
                <tr><td><strong>Пол</strong></td><td>${userGender}</td></tr>
                <tr><td><strong>Инфо</strong></td><td>${extraInfo.value || "—"}</td></tr>
            </table>
        `);
    });

    // Пункт 6: Функция проверки (знание математики И программирования)
    function check() {
        return skillMath.checked && skillProg.checked;
    }
});
