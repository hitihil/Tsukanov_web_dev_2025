// js/filter.js
document.addEventListener("DOMContentLoaded", () => {
    // Состояние фильтров для каждой категории
    const activeFilters = {
        soup: null,
        main: null,
        salad: null,
        drink: null,
        dessert: null
    };

    // Функция фильтрации блюд
    function filterDishes(category, kind) {
        const container = document.querySelector(`.${category} .menu-grid`);
        if (!container) return;

        const cards = container.querySelectorAll('.dish-card');
        console.log(`Фильтрация ${category}: kind=${kind}, карточек: ${cards.length}`);
        
        cards.forEach(card => {
            const dishKind = card.dataset.kind;
            console.log(`Карточка ${card.dataset.dish}: kind=${dishKind}`);
            
            if (!kind || dishKind === kind) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Функция обработки клика по фильтру
    function handleFilterClick(category, button, kind) {
        const filtersContainer = button.closest('.filters');
        const allButtons = filtersContainer.querySelectorAll('.filter-btn');
        
        // Снимаем активный класс со всех кнопок категории
        allButtons.forEach(btn => btn.classList.remove('active'));
        
        // Если кликнули на уже активный фильтр - снимаем фильтр
        if (activeFilters[category] === kind) {
            activeFilters[category] = null;
            filterDishes(category, null);
        } else {
            // Активируем новый фильтр
            activeFilters[category] = kind;
            button.classList.add('active');
            filterDishes(category, kind);
        }
    }

    // Инициализация фильтров
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        console.log('Найдено кнопок фильтров:', filterButtons.length);
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const section = button.closest('section');
                const category = section.className.split(' ')[0];
                const kind = button.dataset.kind;
                console.log(`Клик по фильтру: категория=${category}, kind=${kind}`);
                handleFilterClick(category, button, kind);
            });
        });
        
        console.log('Фильтры инициализированы');
    }

    // ИНИЦИАЛИЗИРУЕМ ФИЛЬТРЫ ПОСЛЕ ЗАГРУЗКИ ДАННЫХ
    window.initFiltersAfterLoad = function() {
        setTimeout(() => {
            initFilters();
        }, 100);
    };
});