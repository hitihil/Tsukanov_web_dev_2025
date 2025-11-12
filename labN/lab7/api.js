// js/api.js
async function loadDishes() {
    try {
        // Выбираем URL в зависимости от окружения
        const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
        
        console.log('Загрузка данных из API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Данные успешно загружены:', data);
        console.log('Первое блюдо:', data[0]);
        
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        
        // Возвращаем локальные данные в случае ошибки
        console.log('Используем локальные данные из array.js');
        return dishes;
    }
}