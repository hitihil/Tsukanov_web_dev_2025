// orders.js
document.addEventListener("DOMContentLoaded", async () => {
    await loadOrders();
    setupModalHandlers();
});

let allOrders = [];

async function loadOrders() {
    try {
        console.log('Загрузка истории заказов...');
        
        // Загружаем заказы из localStorage
        allOrders = window.storageManager.loadOrdersHistory();
        
        console.log('Загружено заказов из localStorage:', allOrders.length);
        
        // Фильтруем пустые заказы
        allOrders = allOrders.filter(order => {
            const hasDishes = order.dishes && Object.keys(order.dishes).length > 0;
            return hasDishes;
        });
        
        // Сортируем по дате (новые сначала)
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        console.log('Финальное количество заказов:', allOrders.length);
        renderOrders();
        
    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        showNotification('Ошибка при загрузке заказов', false);
    }
}

function renderOrders() {
    const container = document.getElementById('orders-container');
    
    if (allOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <p>У вас пока нет заказов</p>
                <a href="create-lunch.html" class="btn" style="background-color: #ff7043; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px;">Сделать первый заказ</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Дата оформления</th>
                    <th>Состав заказа</th>
                    <th>Стоимость</th>
                    <th>Время доставки</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                ${allOrders.map((order, index) => `
                    <tr>
                        <td class="order-number">${index + 1}</td>
                        <td class="order-date">${formatDate(order.created_at)}</td>
                        <td class="order-composition">${getOrderComposition(order)}</td>
                        <td class="order-price">${order.total_price} ₽</td>
                        <td class="order-delivery-time">${getDeliveryTimeText(order)}</td>
                        <td class="actions">
                            <button class="action-btn view-btn" onclick="viewOrder(${order.id})" title="Подробнее">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="action-btn edit-btn" onclick="editOrder(${order.id})" title="Редактировать">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})" title="Удалить">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getOrderComposition(order) {
    const dishes = Object.values(order.dishes).filter(dish => dish !== null);
    return dishes.map(dish => dish.name).join(', ');
}

function getDeliveryTimeText(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        return order.delivery_time;
    }
    return 'Как можно скорее (с 7:00 до 23:00)';
}

function setupModalHandlers() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.querySelector('.modal-close');
    
    // Закрытие по крестику
    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику на overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
}

// Функция просмотра заказа
window.viewOrder = function(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3 class="modal-title">Просмотр заказа</h3>
        
        <div class="order-details-grid">
            <div>
                <h4>Дата оформления</h4>
                <p>${formatDate(order.created_at)}</p>
            </div>
            <div>
                <h4>Доставка</h4>
                <p><strong>Имя получателя:</strong> ${order.full_name}</p>
                <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
                <p><strong>Время доставки:</strong> ${getDeliveryTimeText(order)}</p>
                <p><strong>Телефон:</strong> ${order.phone}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                ${order.comment ? `<p><strong>Комментарий:</strong> ${order.comment}</p>` : ''}
            </div>
        </div>
        
        <h4>Состав заказа</h4>
        <div class="order-dishes">
            ${Object.values(order.dishes).filter(dish => dish !== null).map(dish => `
                <div class="order-dish-item">
                    <span class="order-dish-name">${dish.name}</span>
                    <span class="order-dish-price">${dish.price} ₽</span>
                </div>
            `).join('')}
        </div>
        
        <div class="order-total">
            Стоимость: ${order.total_price} ₽
        </div>
        
        <div class="modal-buttons">
            <button class="btn btn-primary" onclick="closeModal()">Ок</button>
        </div>
    `;
    
    openModal();
};

// Функция редактирования заказа
window.editOrder = function(orderId) {
    console.log('Начало редактирования заказа:', orderId);
    
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
        console.error('Заказ не найден:', orderId);
        return;
    }
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3 class="modal-title">Редактирование заказа</h3>
        
        <form id="edit-order-form">
            <div class="form-group">
                <label for="edit-full_name">Имя получателя *</label>
                <input type="text" id="edit-full_name" name="full_name" value="${order.full_name || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="edit-email">Email *</label>
                <input type="email" id="edit-email" name="email" value="${order.email || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="edit-phone">Телефон *</label>
                <input type="tel" id="edit-phone" name="phone" value="${order.phone || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="edit-delivery_address">Адрес доставки *</label>
                <input type="text" id="edit-delivery_address" name="delivery_address" value="${order.delivery_address || ''}" required>
            </div>
            
            <div class="form-group">
                <label>Тип доставки:</label>
                <div>
                    <label>
                        <input type="radio" name="delivery_type" value="now" ${order.delivery_type === 'now' ? 'checked' : ''}>
                        Как можно скорее
                    </label>
                    <label style="margin-left: 20px;">
                        <input type="radio" name="delivery_type" value="by_time" ${order.delivery_type === 'by_time' ? 'checked' : ''}>
                        Ко времени
                    </label>
                </div>
            </div>
            
            <div class="form-group" id="edit-delivery-time-group" style="${order.delivery_type === 'by_time' ? '' : 'display: none;'}">
                <label for="edit-delivery_time">Время доставки</label>
                <input type="time" id="edit-delivery_time" name="delivery_time" value="${order.delivery_time || ''}" min="07:00" max="23:00" step="300">
            </div>
            
            <div class="form-group">
                <label for="edit-comment">Комментарий</label>
                <textarea id="edit-comment" name="comment">${order.comment || ''}</textarea>
            </div>
            
            <div class="modal-buttons">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Отмена</button>
                <button type="submit" class="btn btn-primary">Сохранить</button>
            </div>
        </form>
    `;
    
    // Обработчики для переключения видимости поля времени
    const deliveryTypeRadios = document.querySelectorAll('input[name="delivery_type"]');
    const timeGroup = document.getElementById('edit-delivery-time-group');
    
    deliveryTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (timeGroup) {
                timeGroup.style.display = radio.value === 'by_time' ? 'block' : 'none';
            }
        });
    });
    
    // Обработчик отправки формы
    const form = document.getElementById('edit-order-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Форма отправлена, сохраняем изменения...');
            saveOrderChanges(orderId);
        });
    }
    
    openModal();
    console.log('Модальное окно открыто');
};

// Функция удаления заказа
window.deleteOrder = function(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3 class="modal-title">Удаление заказа</h3>
        <p class="confirmation-text">Вы уверены, что хотите удалить заказ от ${formatDate(order.created_at)}?</p>
        
        <div class="modal-buttons">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Отмена</button>
            <button type="button" class="btn btn-danger" onclick="confirmDelete(${orderId})">Да</button>
        </div>
    `;
    
    openModal();
};

async function saveOrderChanges(orderId) {
    try {
        console.log('Сохранение изменений для заказа:', orderId);
        
        const form = document.getElementById('edit-order-form');
        const formData = new FormData(form);
        const changes = Object.fromEntries(formData.entries());
        
        console.log('Изменения формы:', changes);
        
        // Валидация
        if (!changes.full_name?.trim()) {
            showNotification('Укажите имя получателя', false);
            return;
        }
        if (!changes.email?.trim()) {
            showNotification('Укажите email', false);
            return;
        }
        if (!changes.phone?.trim()) {
            showNotification('Укажите номер телефона', false);
            return;
        }
        if (!changes.delivery_address?.trim()) {
            showNotification('Укажите адрес доставки', false);
            return;
        }
        
        // Находим заказ
        const orderIndex = allOrders.findIndex(o => o.id === orderId);
        console.log('🔍 Индекс заказа в массиве:', orderIndex);
        
        if (orderIndex === -1) {
            console.error('Заказ не найден в массиве');
            showNotification('Заказ не найден', false);
            return;
        }
        
        // Сохраняем оригинальные данные
        const originalOrder = allOrders[orderIndex];
        
        // Создаем обновленный заказ
        const updatedOrder = {
            ...originalOrder, // сохраняем все оригинальные данные
            full_name: changes.full_name,
            email: changes.email,
            phone: changes.phone,
            delivery_address: changes.delivery_address,
            delivery_type: changes.delivery_type,
            delivery_time: changes.delivery_type === 'by_time' ? changes.delivery_time : null,
            comment: changes.comment || ''
        };
        
        console.log('Оригинальный заказ:', originalOrder);
        console.log('Обновленный заказ:', updatedOrder);
        
        // Сохраняем в localStorage
        console.log('Сохранение в localStorage...');
        const success = window.storageManager.saveOrderToHistory(updatedOrder);
        
        if (success) {
            // Обновляем локальный массив
            allOrders[orderIndex] = updatedOrder;
            
            console.log('Заказ успешно обновлен в localStorage');
            closeModal();
            showNotification('Заказ успешно изменён', true);
            
            // Перерисовываем таблицу
            setTimeout(() => {
                renderOrders();
            }, 100);
            
        } else {
            console.error('Ошибка при сохранении в storageManager');
            showNotification('Ошибка при сохранении изменений', false);
        }
        
    } catch (error) {
        console.error('Критическая ошибка при сохранении изменений:', error);
        showNotification('Ошибка при сохранении изменений: ' + error.message, false);
    }
}

window.confirmDelete = async function(orderId) {
    try {
        // Удаляем заказ
        allOrders = allOrders.filter(o => o.id !== orderId);
        
        // Сохраняем в localStorage
        localStorage.setItem('freshlunch_orders', JSON.stringify(allOrders));
        
        closeModal();
        showNotification('Заказ успешно удалён', true);
        renderOrders(); // Обновляем список
        
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        showNotification('Ошибка при удалении заказа', false);
    }
};

// Вспомогательная функция для уведомлений
function showNotification(message, isSuccess) {
    if (window.createNotification) {
        window.createNotification(message, isSuccess);
    } else {
        // Простой fallback
        alert(message);
    }
}

// Добавьте эту функцию для диагностики
function debugEditOrder(orderId) {
    console.log('=== ДИАГНОСТИКА РЕДАКТИРОВАНИЯ ===');
    console.log('ID заказа для редактирования:', orderId);
    console.log('Все заказы:', allOrders);
    console.log('Поиск заказа...');
    
    const order = allOrders.find(o => o.id === orderId);
    console.log('Найден заказ:', order);
    
    if (!order) {
        console.error('Заказ не найден!');
        console.log('📋 Доступные ID:', allOrders.map(o => ({id: o.id, order_number: o.order_number})));
        return false;
    }
    
    console.log('Данные заказа:');
    console.log('- ID:', order.id);
    console.log('- Номер:', order.order_number);
    console.log('- Имя:', order.full_name);
    console.log('- Email:', order.email);
    console.log('- Блюда:', order.dishes);
    
    return true;
}