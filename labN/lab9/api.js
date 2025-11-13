// api.js
async function loadDishes() {
    try {
        const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return dishes;
    }
}