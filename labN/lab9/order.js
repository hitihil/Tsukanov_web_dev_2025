// order.js
document.addEventListener("DOMContentLoaded", () => {
    window.order = { 
        soup: null, 
        main: null, 
        salad: null,
        drink: null, 
        dessert: null 
    };
    const order = window.order;

    const totalEl = document.querySelector('.total-price');

    function loadInitialOrder() {
        const storedOrder = window.storageManager?.loadOrderFromStorage();
        if (storedOrder) {
            const dishesData = window.dishesData || dishes;
            Object.keys(storedOrder).forEach(category => {
                const dishId = storedOrder[category];
                const dish = dishesData.find(d => d.id === dishId);
                if (dish) {
                    // Исправляем для главных блюд
                    if (category === 'main' && dish.category === 'main-course') {
                        order[category] = dish;
                        const select = document.getElementById(category);
                        if (select) {
                            select.value = dish.keyword;
                        }
                    } else if (dish.category === category) {
                        order[category] = dish;
                        const select = document.getElementById(category);
                        if (select) {
                            select.value = dish.keyword;
                        }
                    }
                }
            });
        }
        updateTotalAndUI();
    }

    function getDishesData() {
        return window.dishesData || dishes;
    }

    function findDishByKeyword(key) {
        const data = getDishesData();
        return data.find(d => d.keyword === key) || null;
    }

    function clearCardSelection(category) {
        let searchCategory = category;
        if (category === 'main') {
            searchCategory = 'main-course';
        }
        
        document.querySelectorAll(`.dish-card[data-category="${searchCategory}"]`).forEach(el => {
            el.classList.remove('selected');
        });
    }

    function highlightCardFor(category, keyword) {
        clearCardSelection(category);
        if (!keyword) return;
        
        // Исправляем для главных блюд
        let searchCategory = category;
        if (category === 'main') {
            searchCategory = 'main-course';
        }
        
        const card = document.querySelector(`.dish-card[data-dish="${keyword}"][data-category="${searchCategory}"]`);
        if (card) card.classList.add('selected');
    }

    function updateTotalAndUI() {
        const items = Object.values(order).filter(Boolean);
        const total = items.reduce((s, it) => s + (it.price || 0), 0);

        if (totalEl) {
            if (total > 0) {
                totalEl.textContent = `Стоимость заказа: ${total} ₽`;
                totalEl.style.display = "block";
            } else {
                totalEl.textContent = "";
                totalEl.style.display = "none";
            }
        }

        Object.keys(order).forEach(cat => {
            const obj = order[cat];
            highlightCardFor(cat, obj ? obj.keyword : null);
        });

        if (window.storageManager) {
            window.storageManager.saveOrderToStorage(order);
        }

        // Обновляем панель оформления
        if (window.updateCheckoutPanel) {
            window.updateCheckoutPanel();
        }
    }

    // Обработчик клика по кнопке "Добавить" в карточке
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.dish-card button');
        if (!btn) return;
        const card = btn.closest('.dish-card');
        if (!card) return;
        const kw = card.dataset.dish;
        const dishCategory = card.dataset.category;
        const dish = findDishByKeyword(kw);
        if (!dish) return;

        // Определяем категорию для объекта order (исправляем для главных блюд)
        let orderCategory = dishCategory;
        if (dishCategory === 'main-course') {
            orderCategory = 'main';
        }

        // Устанавливаем блюдо в заказ
        order[orderCategory] = dish;
        
        // Устанавливаем значение в соответствующем select
        const select = document.getElementById(orderCategory);
        if (select) {
            select.value = dish.keyword;
        }
        
        updateTotalAndUI();
    });

    // Обработчик изменения select'ов в форме
    document.addEventListener('change', (e) => {
        if (e.target.matches('select[name="soup"], select[name="main"], select[name="salad"], select[name="drink"], select[name="dessert"]')) {
            const select = e.target;
            const category = select.name;
            const keyword = select.value;
            
            if (keyword) {
                const dish = findDishByKeyword(keyword);
                if (dish) {
                    // Проверяем соответствие категории (исправляем для главных блюд)
                    if ((category === 'main' && dish.category === 'main-course') || dish.category === category) {
                        order[category] = dish;
                        // Подсвечиваем соответствующую карточку
                        highlightCardFor(category, keyword);
                    }
                }
            } else {
                // Если выбран пустой вариант, удаляем блюдо из заказа
                order[category] = null;
                clearCardSelection(category);
            }
            
            updateTotalAndUI();
        }
    });

    loadInitialOrder();
});

window.goToCheckout = function() {
    // Заказ уже проверяется в validation.js
    // Просто сохраняем и переходим
    if (window.storageManager) {
        window.storageManager.saveOrderToStorage(window.order);
    }
    window.location.href = 'checkout.html';
};