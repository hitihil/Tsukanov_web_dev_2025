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
        console.log(`Фильтрация категории: ${category}, тип: ${kind}`);
        
        // Находим контейнер по ID фильтров
        const filtersId = `${category}-filters`;
        const filtersContainer = document.getElementById(filtersId);
        if (!filtersContainer) {
            console.log(`Фильтры не найдены: ${filtersId}`);
            return;
        }
        
        const section = filtersContainer.closest('section');
        if (!section) {
            console.log('Секция не найдена');
            return;
        }
        
        const container = section.querySelector('.menu-grid');
        if (!container) {
            console.log('Контейнер меню не найден');
            return;
        }

        const cards = container.querySelectorAll('.dish-card');
        console.log(`Найдено карточек в категории ${category}: ${cards.length}`);
        
        let visibleCount = 0;
        cards.forEach(card => {
            const dishKind = card.dataset.kind;
            
            if (!kind || dishKind === kind) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        console.log(`Осталось видимых в категории ${category}: ${visibleCount}`);
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
                const filtersContainer = button.closest('.filters');
                if (!filtersContainer) {
                    console.log('Контейнер фильтров не найден');
                    return;
                }
                
                // Получаем категорию из ID контейнера фильтров
                const filtersId = filtersContainer.id;
                let category;
                
                if (filtersId === 'soup-filters') {
                    category = 'soup';
                } else if (filtersId === 'main-filters') {
                    category = 'main';
                } else if (filtersId === 'salad-filters') {
                    category = 'salad';
                } else if (filtersId === 'drink-filters') {
                    category = 'drink';
                } else if (filtersId === 'dessert-filters') {
                    category = 'dessert';
                } else {
                    console.log('Неизвестная категория фильтров:', filtersId);
                    return;
                }
                
                const kind = button.dataset.kind;
                console.log(`Клик по фильтру: категория=${category}, kind=${kind}`);
                handleFilterClick(category, button, kind);
            });
        });
        
        console.log('Фильтры инициализированы для всех категорий');
    }

    // ИНИЦИАЛИЗИРУЕМ ФИЛЬТРЫ ПОСЛЕ ЗАГРУЗКИ ДАННЫХ
    window.initFiltersAfterLoad = function() {
        console.log('Инициализация фильтров после загрузки данных...');
        setTimeout(() => {
            initFilters();
        }, 100);
    };
});