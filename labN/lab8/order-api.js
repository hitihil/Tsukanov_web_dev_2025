// order-api.js
const API_BASE_URL = 'https://edu.std-900.ist.mospolytech.ru';
const API_KEY = '1ceec39f-b9da-4a11-bf46-8bb584f8763d';

async function submitOrderToServer(orderData) {
    console.log('Отправка заказа на сервер...');
    
    try {
        console.log('📡 Пытаемся отправить на реальный API...');
        const result = await submitOrderRealAPI(orderData);
        console.log('Успешно отправлено на сервер:', result);
        return {
            ...result,
            server_status: 'connected',
            message: 'Заказ успешно создан на сервере!'
        };
        
    } catch (error) {
        console.error('Ошибка реального API:', error);
        console.log('Переключаемся в демо-режим...');
        
        // демо-режим для тестирования
        const demoResult = await submitOrderDemo(orderData);
        return {
            ...demoResult,
            server_status: 'demo',
            message: 'Заказ успешно создан! (демо-режим)'
        };
    }
}

async function submitOrderRealAPI(orderData) {
    const storageOrder = window.storageManager.loadOrderFromStorage();
    
    // Формируем данные
    const apiData = {
        full_name: orderData.full_name,
        email: orderData.email,
        subscribe: orderData.subscribe ? 1 : 0,
        phone: orderData.phone,
        delivery_address: orderData.delivery_address,
        delivery_type: orderData.delivery_type,
        comment: orderData.comment || ''
    };

    // Добавляем ID блюд
    if (storageOrder.soup) apiData.soup_id = storageOrder.soup;
    if (storageOrder.main) apiData.main_course_id = storageOrder.main;
    if (storageOrder.salad) apiData.salad_id = storageOrder.salad;
    if (storageOrder.drink) apiData.drink_id = storageOrder.drink;
    if (storageOrder.dessert) apiData.dessert_id = storageOrder.dessert;

    // Время доставки
    if (orderData.delivery_type === 'by_time' && orderData.delivery_time) {
        apiData.delivery_time = orderData.delivery_time.replace(':', '');
    }

    console.log('Отправляемые данные:', apiData);

    const response = await fetch(`${API_BASE_URL}/api/orders?api_key=${API_KEY}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function submitOrderDemo(orderData) {
    console.log('🎭 Работаем в демо-режиме...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storageOrder = window.storageManager.loadOrderFromStorage();
    const dishesData = window.dishesData || dishes;
    
    let totalPrice = 0;
    Object.values(storageOrder).forEach(dishId => {
        const dish = dishesData.find(d => d.id === dishId);
        if (dish) totalPrice += dish.price;
    });
    
    const demoOrder = {
        id: Math.floor(100000 + Math.random() * 900000),
        order_number: `DEMO-${Date.now()}`,
        full_name: orderData.full_name,
        email: orderData.email,
        phone: orderData.phone,
        delivery_address: orderData.delivery_address,
        total_price: totalPrice,
        status: 'created',
        created_at: new Date().toISOString()
    };
    
    console.log('Заказ создан:', demoOrder);
    return demoOrder;
}

window.orderAPI = {
    submitOrderToServer
};

console.log('🎯 Order API загружен');