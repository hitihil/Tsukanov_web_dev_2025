// checkout.js
window.createNotification = function(message, isSuccess = false) {
    // Удаляем старое уведомление если есть
    const oldNotification = document.getElementById('dynamic-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.id = 'dynamic-notification';
    notification.className = 'notification';
    
    const icon = isSuccess ? '✅' : '⚠️';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icon}</div>
            <p>${message}</p>
            <button class="notification-btn">Окей</button>
        </div>
    `;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку
    
    // Обработчики событий
    const okButton = notification.querySelector('.notification-btn');
    okButton.addEventListener('click', () => {
        notification.remove();
        document.body.style.overflow = ''; // Разблокируем прокрутку
    });
    
    // Закрытие при клике на фон
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            notification.remove();
            document.body.style.overflow = ''; // Разблокируем прокрутку
        }
    });
    
    return notification;
};
document.addEventListener("DOMContentLoaded", async () => {
    // Автозаполнение данных пользователя при загрузке страницы оформления
    const userData = window.userDataManager?.loadUserData();
    if (userData) {
        if (userData.full_name) document.getElementById('full_name').value = userData.full_name;
        if (userData.email) document.getElementById('email').value = userData.email;
        if (userData.phone) document.getElementById('phone').value = userData.phone;
        if (userData.delivery_address) document.getElementById('delivery_address').value = userData.delivery_address;
        if (userData.subscribe) document.getElementById('subscribe').checked = true;
    }

    let dishesData = [];
    
    try {
        // Загружаем данные блюд
        dishesData = await loadDishes();
        window.dishesData = dishesData;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        dishesData = dishes;
        window.dishesData = dishes;
    }

    // Загружаем заказ из localStorage
    const storageOrder = window.storageManager.loadOrderFromStorage();
    const fullOrder = await window.storageManager.getFullOrderData(storageOrder);
    
    // Отображаем заказ
    renderOrderItems(fullOrder);
    renderSelectedDishes(fullOrder);
    setupEventListeners();
});

function renderOrderItems(order) {
    const container = document.getElementById('order-items');
    
    if (Object.keys(order).length === 0) {
        container.innerHTML = `
            <div class="empty-order">
                <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу 
                <a href="create-lunch.html">Собрать ланч</a>.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    
    Object.values(order).forEach(dish => {
        const itemCard = document.createElement('div');
        itemCard.className = 'order-item-card';
        itemCard.dataset.id = dish.id;
        
        itemCard.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" onerror="this.src='placeholder.jpg'">
            <div class="price">${dish.price} ₽</div>
            <div class="name">${dish.name}</div>
            <div class="weight">${dish.count}</div>
            <button class="remove-btn" onclick="removeFromOrder(${dish.id})">Удалить</button>
        `;
        
        container.appendChild(itemCard);
    });
}

function renderSelectedDishes(order) {
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    
    categories.forEach(category => {
        const container = document.getElementById(`selected-${category}`);
        const dish = order[category];
        
        if (dish) {
            container.innerHTML = `
                <div class="selected-dish-info">
                    <span class="dish-name">${dish.name}</span>
                    <span class="dish-price">${dish.price} ₽</span>
                </div>
            `;
        } else {
            container.innerHTML = `<span class="not-selected">${getNotSelectedText(category)}</span>`;
        }
    });
    
    // Обновляем общую стоимость
    const total = Object.values(order).reduce((sum, dish) => sum + dish.price, 0);
    document.getElementById('checkout-total').innerHTML = `<strong>Стоимость заказа: ${total} ₽</strong>`;
}

function getNotSelectedText(category) {
    const texts = {
        'soup': 'Не выбран',
        'main': 'Не выбрано', 
        'salad': 'Не выбран',
        'drink': 'Не выбран',
        'dessert': 'Не выбран'
    };
    return texts[category] || 'Не выбран';
}

function setupEventListeners() {
    const deliveryTypeRadios = document.querySelectorAll('input[name="delivery_type"]');
    const deliveryTimeGroup = document.getElementById('delivery-time-group');
    
    deliveryTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            deliveryTimeGroup.style.display = radio.value === 'by_time' ? 'block' : 'none';
            if (radio.value === 'by_time') {
                document.getElementById('delivery_time').required = true;
            } else {
                document.getElementById('delivery_time').required = false;
            }
        });
    });
    
    // Обработка отправки формы
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', handleOrderSubmit);
    
    // Сохранение данных пользователя при вводе
    const userInputs = form.querySelectorAll('input, textarea');
    userInputs.forEach(input => {
        input.addEventListener('input', saveUserDataToStorage);
        input.addEventListener('change', saveUserDataToStorage);
    });
}

function saveUserDataToStorage() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const userData = {};
    
    formData.forEach((value, key) => {
        if (key !== 'delivery_time' || formData.get('delivery_type') === 'by_time') {
            userData[key] = value;
        }
    });
    
    if (window.userDataManager) {
        window.userDataManager.saveUserData(userData);
    }
}

// Функция удаления блюда из заказа
window.removeFromOrder = function(dishId) {
    const storageOrder = window.storageManager.loadOrderFromStorage();
    let updated = false;
    
    // Удаляем блюдо из заказа по ID
    Object.keys(storageOrder).forEach(category => {
        if (storageOrder[category] === dishId) {
            delete storageOrder[category];
            updated = true;
        }
    });
    
    if (updated) {
        // Сохраняем обновленный заказ
        localStorage.setItem('freshlunch_order', JSON.stringify(storageOrder));
        
        // Перезагружаем страницу для обновления данных
        location.reload();
    }
};

// Функция очистки всего заказа
window.clearOrder = function() {
    if (confirm('Вы уверены, что хотите очистить весь заказ?')) {
        window.storageManager.clearOrderFromStorage();
        location.reload();
    }
};

// Обработчик отправки заказа
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const orderData = Object.fromEntries(formData.entries());
    
    console.log('📝 Данные формы:', orderData);
    
    // ВАЛИДАЦИЯ КОМБО
    if (window.validateOrder) {
        const validation = window.validateOrder();
        console.log('📋 Результат валидации:', validation);
        
        if (!validation.isValid) {
            console.log('Заказ невалиден:', validation.message);
            window.createNotification(validation.message);
            return;
        }
    }
    
    // ВАЛИДАЦИЯ ПОЛЕЙ ФОРМЫ
    const formErrors = [];
    if (!orderData.full_name?.trim()) formErrors.push('Укажите ваше имя');
    if (!orderData.email?.trim()) formErrors.push('Укажите email');
    if (!orderData.phone?.trim()) formErrors.push('Укажите номер телефона');
    if (!orderData.delivery_address?.trim()) formErrors.push('Укажите адрес доставки');
    if (orderData.delivery_type === 'by_time' && !orderData.delivery_time) {
        formErrors.push('Укажите время доставки');
    }
    
    if (formErrors.length > 0) {
        window.createNotification(formErrors.join('\n'));
        return;
    }
    
    // ОТПРАВКА
    try {
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        console.log('🚀 Начинаем отправку заказа...');
        
        // ПОЛУЧАЕМ ДАННЫЕ О БЛЮДАХ ПЕРЕД ОТПРАВКОЙ
        const storageOrder = window.storageManager.loadOrderFromStorage();
        const fullOrder = await window.storageManager.getFullOrderData(storageOrder);
        
        console.log('🍽️ Состав заказа:', fullOrder);
        
        // Проверяем, что заказ не пустой
        if (Object.keys(fullOrder).length === 0) {
            throw new Error('Заказ пустой. Добавьте блюда в заказ.');
        }
        
        const totalPrice = Object.values(fullOrder).reduce((sum, dish) => sum + dish.price, 0);
        
        const result = await window.orderAPI.submitOrderToServer(orderData);
        console.log('Результат:', result);
        
        /*// СОХРАНЕНИЕ В ИСТОРИЮ ЗАКАЗОВ
        if (result) {
        // Объединяем данные формы и результат от сервера
        const historyOrderData = {
        ...orderData,           // данные формы
        ...result,              // данные от сервера (id, order_number, etc)
        dishes: fullOrder,      // состав заказа
        otal_price: totalPrice // общая стоимость
        };
        
        window.storageManager.saveOrderToHistory(historyOrderData);
        console.log('Заказ сохранен в историю:', historyOrderData);
        } */
        
        // Очищаем текущий заказ из localStorage
        window.storageManager.clearOrderFromStorage();
        
        // Показываем успех
        const successMessage = result.server_status === 'demo' 
            ? 'Заказ успешно создан!' 
            : `Заказ успешно оформлен! Номер: ${result.id || result.order_number}`;
            
        window.createNotification(successMessage, true);
        
        // Переход на главную
        setTimeout(() => {
            window.location.href = 'lab9.html';
        }, 3000);
        
    } catch (error) {
        console.error('Ошибка:', error);
        window.createNotification('Ошибка при оформлении заказа: ' + error.message);
        
        // Разблокируем кнопку
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.textContent = 'Отправить заказ';
        submitBtn.disabled = false;
    }
}

window.handleOrderSubmit = handleOrderSubmit;

// Валидация полей формы
function validateFormData(orderData) {
    const errors = [];
    
    if (!orderData.full_name || orderData.full_name.trim() === '') {
        errors.push('Укажите ваше имя');
    }
    
    if (!orderData.email || orderData.email.trim() === '') {
        errors.push('Укажите email');
    } else if (!isValidEmail(orderData.email)) {
        errors.push('Укажите корректный email');
    }
    
    if (!orderData.phone || orderData.phone.trim() === '') {
        errors.push('Укажите номер телефона');
    }
    
    if (!orderData.delivery_address || orderData.delivery_address.trim() === '') {
        errors.push('Укажите адрес доставки');
    }
    
    if (orderData.delivery_type === 'by_time' && !orderData.delivery_time) {
        errors.push('Укажите время доставки');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Сделаем функцию глобальной
window.handleOrderSubmit = handleOrderSubmit;