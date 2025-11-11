// js/validation.js
document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById('order-form');
    
    // Функция для создания уведомления динамически
    function createNotification(message) {
        // Удаляем старое уведомление если есть
        const oldNotification = document.getElementById('dynamic-notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.id = 'dynamic-notification';
        notification.className = 'notification';
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">⚠️</div>
                <p>${message}</p>
                <button class="notification-btn">Окей</button>
            </div>
        `;
        
        // Добавляем на страницу
        document.body.appendChild(notification);
        
        // Обработчики событий
        const okButton = notification.querySelector('.notification-btn');
        okButton.addEventListener('click', () => {
            notification.remove();
        });
        
        // Закрытие при клике на фон
        notification.addEventListener('click', (e) => {
            if (e.target === notification) {
                notification.remove();
            }
        });
        
        // Эффекты при наведении на кнопку
        okButton.addEventListener('mouseenter', () => {
            okButton.style.backgroundColor = '#e64a19';
            okButton.style.color = 'white';
        });
        
        okButton.addEventListener('mouseleave', () => {
            okButton.style.backgroundColor = '#ff7043';
            okButton.style.color = 'white';
        });
    }
    
    function validateOrder() {
        // Получаем текущее состояние заказа
        const selected = {
            soup: !!window.order?.soup,
            main: !!window.order?.main, 
            salad: !!window.order?.salad,
            drink: !!window.order?.drink,
            dessert: !!window.order?.dessert
        };
        
        // Считаем количество выбранных блюд
        const totalSelected = Object.values(selected).filter(Boolean).length;
        
        // 1) ЕСЛИ НИЧЕГО НЕ ВЫБРАНО
        if (totalSelected === 0) {
            return { isValid: false, message: 'Ничего не выбрано. Выберите блюда для заказа' };
        }

       // РАЗРЕШЕННЫЕ КОМБИНАЦИИ (добавить эту проверку ПЕРВОЙ)
        if ((selected.soup && selected.main && selected.drink) || // Суп + Главное + Напиток
            (selected.soup && selected.salad && selected.drink) || // Суп + Салат + Напиток  
            (selected.dessert && !selected.soup && !selected.main && !selected.salad && !selected.drink)) { // Только десерт
            return { isValid: true };
        }
        
        // 2) ЕСЛИ ВЫБРАНЫ ВСЕ БЛЮДА, КРОМЕ НАПИТКА
        // Это когда есть суп И главное И салат, но нет напитка
        if (selected.soup && selected.main && selected.salad && !selected.drink) {
            return { isValid: false, message: 'Выберите напиток' };
        }
        
        // 3) ЕСЛИ ВЫБРАН СУП, НО НЕ ВЫБРАНЫ ГЛАВНОЕ БЛЮДО ИЛИ САЛАТ
        // Это когда есть суп, но нет главного ИЛИ нет салата
        if (selected.soup && (!selected.main || !selected.salad)) {
            return { isValid: false, message: 'Выберите главное блюдо или салат/стартер' };
        }
        
        // 4) ЕСЛИ ВЫБРАН САЛАТ, НО НЕ ВЫБРАНЫ СУП ИЛИ ГЛАВНОЕ БЛЮДО
        // Это когда есть салат, но нет супа И нет главного
        if (selected.salad && !selected.soup && !selected.main) {
            return { isValid: false, message: 'Выберите суп или главное блюдо' };
        }
        
        // 5) ЕСЛИ ВЫБРАН НАПИТОК ИЛИ ДЕСЕРТ, НО НЕ ВЫБРАНО ГЛАВНОЕ БЛЮДО
        // Это когда есть напиток ИЛИ десерт, но нет главного блюда
        if ((selected.drink || selected.dessert) && !selected.main) {
            return { isValid: false, message: 'Выберите главное блюдо' };
        }
        
        // Если прошли все проверки - заказ валиден
        return { isValid: true };
    }
    
    // Обработчик отправки формы
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const validation = validateOrder();
            
            if (!validation.isValid) {
                createNotification(validation.message);
            } else {
                // Если заказ валиден, отправляем форму
                orderForm.submit();
            }
        });
    }
});