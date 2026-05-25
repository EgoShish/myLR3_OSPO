// 1. Запрос имени пользователя
let name = prompt("Введите ваше имя:", "Иван");
if (name === null || name.trim() === "") {
    name = "Не указано";
}

// 2. Цикл запроса возраста с защитой от "Отмены" и проверкой через confirm
let age;
while (true) {
    age = prompt("Введите ваш возраст:");
    
    // Перехват нажатия кнопки "Отмена" или пустого ввода
    if (age === null || age.trim() === "") {
        alert("Вы не ввели возраст! Пожалуйста, повторите ввод.");
        continue; // Возврат в начало цикла
    }

    // Проверка, что введено именно число
    if (isNaN(age) || parseInt(age) < 0) {
        alert("Возраст должен быть корректным числом.");
        continue; // Возврат в начало цикла
    }

    // Запрос подтверждения правильности ввода
    let isCorrect = confirm(`Вы ввели: ${age} лет. Всё верно?`);
    if (isCorrect) {
        break; // Выход из бесконечного цикла, возраст принят
    } else {
        alert("Хорошо, давайте введем возраст заново.");
    }
}

// 3. Запрос статуса студента
let isStudent = confirm("Вы являетесь студентом?");

// 4. Находим контейнер на HTML-странице по его ID
let container = document.getElementById("tableContainer");

// 5. Динамически создаем HTML-структуру таблицы и записываем в нее наши переменные
container.innerHTML = `
    <table class="user-table">
        <thead>
            <tr>
                <th>Параметр</th>
                <th>Значение анкеты</th>
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
                <td><strong>Статус студента</strong></td>
                <td>${isStudent ? "Да, студент" : "Нет, не студент"}</td>
            </tr>
        </tbody>
    </table>
`;