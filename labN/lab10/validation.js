// js/validation.js
// Глобальная функция для создания уведомлений
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

document.addEventListener("DOMContentLoaded", () => {
    // Упрощенная и надежная функция валидации
    function validateOrder() {
        // Получаем заказ из localStorage
        const storageOrder = window.storageManager ? window.storageManager.loadOrderFromStorage() : {};
        
        console.log('🔍 Проверка заказа:', storageOrder);
        
        // Определяем выбранные категории
        const selected = {
            soup: !!storageOrder.soup,
            main: !!storageOrder.main, 
            salad: !!storageOrder.salad,
            drink: !!storageOrder.drink,
            dessert: !!storageOrder.dessert
        };
        
        // Считаем количество выбранных блюд
        const totalSelected = Object.values(selected).filter(Boolean).length;
        
        // 1) не добавлено ни одного блюда
        if (totalSelected === 0) {
            return { isValid: false, message: 'Ничего не выбрано. Выберите блюда для заказа' };
        }

        // ПРОСТАЯ ПРОВЕРКА РАЗРЕШЕННЫХ КОМБО
        let isValidCombo = false;
        
        // Комбо 1: суп + главное + салат + напиток
        if (selected.soup && selected.main && selected.salad && selected.drink) {
            isValidCombo = true;
        }
        // Комбо 2: суп + главное + напиток
        else if (selected.soup && selected.main && selected.drink) {
            isValidCombo = true;
        }
        // Комbo 3: суп + салат + напиток
        else if (selected.soup && selected.salad && selected.drink) {
            isValidCombo = true;
        }
        // Комбо 4: главное + салат + напиток
        else if (selected.main && selected.salad && selected.drink) {
            isValidCombo = true;
        }
        // Комбо 5: главное + напиток
        else if (selected.main && selected.drink) {
            isValidCombo = true;
        }

        console.log('✅ Валидная комбинация:', isValidCombo);

        if (isValidCombo) {
            return { isValid: true };
        }

        // ПРОВЕРКИ ДЛЯ УВЕДОМЛЕНИЙ
        
        // Проверяем основные комбинации без напитка
        const hasSoupMainSalad = selected.soup && selected.main && selected.salad;
        const hasSoupMain = selected.soup && selected.main;
        const hasSoupSalad = selected.soup && selected.salad;
        const hasMainSalad = selected.main && selected.salad;
        
        // 2) выбраны все необходимые блюда, кроме напитка
        if ((hasSoupMainSalad || hasSoupMain || hasSoupSalad || hasMainSalad) && !selected.drink) {
            return { isValid: false, message: 'Выберите напиток' };
        }
        
        // 3) выбран суп, но не выбраны главное блюдо/салат
        if (selected.soup && !selected.main && !selected.salad) {
            return { isValid: false, message: 'Выберите главное блюдо или салат/стартер' };
        }
        
        // 4) выбран салат, но не выбраны суп/главное блюдо
        if (selected.salad && !selected.soup && !selected.main) {
            return { isValid: false, message: 'Выберите суп или главное блюдо' };
        }
        
        // 5) выбран напиток/десерт без основных блюд
        const hasMainDishes = selected.soup || selected.main || selected.salad;
        if ((selected.drink || selected.dessert) && !hasMainDishes) {
            return { isValid: false, message: 'Выберите главное блюдо' };
        }
        
        // Общий случай
        return { isValid: false, message: 'Состав заказа не соответствует ни одному из доступных комбо' };
    }
    
    // Валидация для страницы "Оформить заказ"
    function setupCheckoutValidation() {
        const checkoutForm = document.getElementById('checkout-form');
        
        if (checkoutForm) {
            console.log('🎯 Настраиваю валидацию для формы оформления заказа');
            
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('🔄 Обработка отправки формы...');
                
                const validation = validateOrder();
                console.log('📋 Результат валидации:', validation);
                
                if (!validation.isValid) {
                    console.log('❌ Заказ невалиден:', validation.message);
                    createNotification(validation.message);
                } else {
                    console.log('✅ Заказ валиден, отправляем...');
                    // Вызываем функцию отправки заказа
                    if (window.handleOrderSubmit) {
                        window.handleOrderSubmit(e);
                    } else {
                        console.error('❌ handleOrderSubmit не найдена');
                        createNotification('Ошибка системы');
                    }
                }
            });
        } else {
            console.log('❌ Форма оформления заказа не найдена');
        }
    }
    
    // Инициализация
    if (document.getElementById('checkout-form')) {
        console.log('🚀 Инициализация валидации для страницы "Оформить заказ"');
        setupCheckoutValidation();
    }
    
    // Делаем функцию доступной глобально
    window.validateOrder = validateOrder;
});

console.log('🎯 Модуль валидации загружен');