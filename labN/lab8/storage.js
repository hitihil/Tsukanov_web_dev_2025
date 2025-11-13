// storage.js
const STORAGE_KEY = 'freshlunch_order';

// Функции для работы с localStorage
function saveOrderToStorage(order) {
    try {
        // Сохраняем только ID блюд
        const storageOrder = {};
        Object.keys(order).forEach(category => {
            if (order[category]) {
                storageOrder[category] = order[category].id;
            }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageOrder));
        console.log('Заказ сохранен в localStorage:', storageOrder);
    } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
    }
}

function loadOrderFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const storageOrder = JSON.parse(stored);
            console.log('Заказ загружен из localStorage:', storageOrder);
            return storageOrder;
        }
    } catch (error) {
        console.error('Ошибка при загрузке из localStorage:', error);
    }
    return {};
}

function clearOrderFromStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Заказ очищен из localStorage');
    } catch (error) {
        console.error('Ошибка при очистке localStorage:', error);
    }
}

// Функция для получения полных данных блюд по ID
async function getFullOrderData(storageOrder) {
    const fullOrder = {};
    const dishesData = window.dishesData || dishes;
    
    for (const [category, dishId] of Object.entries(storageOrder)) {
        const dish = dishesData.find(d => d.id === dishId);
        if (dish) {
            fullOrder[category] = dish;
        }
    }
    
    return fullOrder;
}

// Экспортируем функции
window.storageManager = {
    saveOrderToStorage,
    loadOrderFromStorage, 
    clearOrderFromStorage,
    getFullOrderData
};