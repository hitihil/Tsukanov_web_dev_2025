// checkout-panel.js
document.addEventListener("DOMContentLoaded", () => {
    initializeCheckoutPanel();
    setupUserDataHandlers();
});

function initializeCheckoutPanel() {
    // Обновляем панель при изменении заказа
    if (window.order) {
        updateCheckoutPanel();
        
        // Следим за изменениями в заказе
        const originalUpdate = window.updateTotalAndUI;
        window.updateTotalAndUI = function() {
            if (typeof originalUpdate === 'function') {
                originalUpdate();
            }
            updateCheckoutPanel();
        };
    }
}

function setupUserDataHandlers() {
    // Сохраняем данные пользователя при изменении
    const userForm = document.getElementById('user-data-form');
    if (userForm) {
        const inputs = userForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const formData = new FormData(userForm);
                window.userDataManager.saveUserData(formData);
            });
            
            input.addEventListener('change', () => {
                const formData = new FormData(userForm);
                window.userDataManager.saveUserData(formData);
            });
        });
    }
}

function updateCheckoutPanel() {
    const panel = document.getElementById('checkout-panel');
    const currentTotal = document.getElementById('current-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!panel || !currentTotal || !checkoutBtn) return;
    
    const order = window.order || {};
    const items = Object.values(order).filter(Boolean);
    const total = items.reduce((sum, dish) => sum + dish.price, 0);
    
    // Показываем/скрываем панель
    if (items.length > 0) {
        panel.style.display = 'block';
        currentTotal.textContent = `Стоимость: ${total} ₽`;
    } else {
        panel.style.display = 'none';
        return;
    }
    
    // Проверяем валидность комбо
    const isValidCombo = validateOrderCombo(order);
    
    if (isValidCombo) {
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.style.pointerEvents = 'auto';
        checkoutBtn.style.opacity = '1';
    } else {
        checkoutBtn.classList.add('disabled');
        checkoutBtn.style.pointerEvents = 'none';
        checkoutBtn.style.opacity = '0.6';
    }
}

function validateOrderCombo(order) {
    // Используем существующую валидацию
    if (window.validateOrder) {
        const validation = window.validateOrder();
        return validation.isValid;
    }
    
    // Базовая проверка
    const selected = {
        soup: !!order.soup,
        main: !!order.main,
        salad: !!order.salad,
        drink: !!order.drink,
        dessert: !!order.dessert
    };
    
    // Простые комбо правила
    return (selected.soup && selected.main && selected.drink) ||
           (selected.soup && selected.salad && selected.drink) ||
           (selected.dessert && !selected.soup && !selected.main && !selected.salad && !selected.drink);
}

// Проверка перед переходом на страницу оформления
window.validateBeforeCheckout = function() {
    if (window.validateOrder) {
        const validation = window.validateOrder();
        if (!validation.isValid) {
            alert(validation.message);
            return false;
        }
    }
    return true;
};