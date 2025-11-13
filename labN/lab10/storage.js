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

// Функции для работы с историей заказов
function saveOrderToHistory(orderData) {
    try {
        console.log('🕵️‍♂️ saveOrderToHistory ВЫЗВАНА!');
        console.log('Сохраняемый заказ:', {
            номер: orderData.order_number,
            id: orderData.id,
            имя: orderData.full_name,
            тип: orderData.order_number?.includes('DEMO') ? 'ДЕМО' : 'РЕАЛЬНЫЙ'
        });
        const orders = JSON.parse(localStorage.getItem('freshlunch_orders') || '[]');
        
        console.log('Сохранение заказа в историю. ID:', orderData.id);
        console.log('Текущее количество заказов:', orders.length);
        
        // Проверяем, не существует ли уже заказ с таким order_number
        const existingOrderIndex = orders.findIndex(order => 
            order.order_number === orderData.order_number
        );
        
        if (existingOrderIndex !== -1) {
            console.log('Заказ уже существует, обновляем:', orderData.order_number);
            orders[existingOrderIndex] = orderData;
        } else {
            // Новый заказ
            const newOrder = {
                ...orderData,
                id: orderData.id || Date.now(),
                created_at: orderData.created_at || new Date().toISOString()
            };
            orders.push(newOrder);
            console.log('Добавлен новый заказ:', orderData.order_number);
        }
        
        localStorage.setItem('freshlunch_orders', JSON.stringify(orders));
        console.log('Всего заказов после сохранения:', orders.length);
        return true;
        
    } catch (error) {
        console.error('Ошибка при сохранении в историю:', error);
        return false;
    }
}

function loadOrdersHistory() {
    try {
        const orders = JSON.parse(localStorage.getItem('freshlunch_orders') || '[]');
        console.log('История заказов загружена:', orders.length, 'заказов');
        return orders;
    } catch (error) {
        console.error('Ошибка при загрузке истории:', error);
        return [];
    }
}

// Обновляем экспорт
window.storageManager = {
    saveOrderToStorage,
    loadOrderFromStorage, 
    clearOrderFromStorage,
    getFullOrderData,
    saveOrderToHistory,
    loadOrdersHistory
};
