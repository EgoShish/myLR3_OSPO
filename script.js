// Ждем загрузки DOM дерева
document.addEventListener("DOMContentLoaded", () => {

    // --- ЛОГИКА ДЛЯ РЕЗЮМЕ (Задание 4) ---
    const changeNameBtn = document.getElementById("changeNameBtn");
    const lastNameInput = document.getElementById("lastNameInput");
    const userLastName = document.getElementById("userLastName");

    changeNameBtn.addEventListener("click", () => {
        const newName = lastNameInput.value.trim();
        if (newName !== "") {
            userLastName.innerText = newName; // Меняем текст фамилии
            lastNameInput.value = ""; // Очищаем поле ввода
        } else {
            alert("Пожалуйста, введите фамилию в поле!");
        }
    });


    // --- ЛОГИКА ДЛЯ АНКЕТЫ-ТАБЛИЦЫ (Задания 2 и 3) ---
    const startSurveyBtn = document.getElementById("startSurveyBtn");
    const tableOutput = document.getElementById("tableOutput");

    startSurveyBtn.addEventListener("click", () => {
        // 1. Запрос имени
        let name = prompt("Введите ваше имя для анкеты:", "Иван");
        if (name === null || name.trim() === "") {
            name = "Не указано";
        }

        // 2. Запрос возраста с циклом проверки на "Отмену" и "Confirm"
        let age;
        while (true) {
            age = prompt("Введите ваш возраст для анкеты:");
            
            if (age === null || age.trim() === "") {
                alert("Вы не ввели возраст! Пожалуйста, повторите ввод.");
                continue; 
            }

            if (isNaN(age) || parseInt(age) < 0) {
                alert("Возраст должен быть корректным числом.");
                continue;
            }

            // Окно повторного подтверждения (если отмена — вернет в цикл ввода)
            let isCorrect = confirm(`Вы ввели возраст: ${age}. Всё верно?`);
            if (isCorrect) {
                break; // Возраст принят, выходим
            } else {
                alert("Давайте исправим возраст.");
            }
        }

        // 3. Запрос статуса студента
        let isStudent = confirm("Вы являетесь студентом?");

        // 4. Отрисовка таблицы вместо кнопки
        tableOutput.innerHTML = `
            <table class="user-table">
                <thead>
                    <tr>
                        <th>Параметр</th>
                        <th>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Имя</strong></td>
                        <td>${name}</td>
                    </tr>
                    <tr>
                        <td><strong>Возраст</strong></td>
                        <td>${age}</td>
                    </tr>
                    <tr>
                        <td><strong>Студент</strong></td>
                        <td>${isStudent ? "Да" : "Нет"}</td>
                    </tr>
                </tbody>
            </table>
        `;
    });
});
