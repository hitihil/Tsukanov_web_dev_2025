document.addEventListener("DOMContentLoaded", async () => {
    let dishesData = [];
    
    try {
        dishesData = await loadDishes();
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        dishesData = dishes;
    }

    renderDishes(dishesData);
});

function normalizeCategories(dishesData) {
    return dishesData.map(dish => {
        let normalizedCategory = dish.category;
        
        // Нормализация категорий
        if (dish.category === 'main-course') {
            normalizedCategory = 'main';
        }
        
        return {
            ...dish,
            category: normalizedCategory,
            // kind остается как есть - dish.kind
        };
    });
}

function renderDishes(dishesData) {
    // Нормализуем категории
    const normalizedData = normalizeCategories(dishesData);
    
    // Категории и соответствующие селект/контейнеры
    const mapping = {
        soup:  { sectionSelector: ".soups .menu-grid", selectId: "soup", label: "Выберите суп" },
        main:  { sectionSelector: ".mains .menu-grid", selectId: "main", label: "Выберите главное блюдо" },
        salad: { sectionSelector: ".salads .menu-grid", selectId: "salad", label: "Выберите салат или стартер" },
        drink: { sectionSelector: ".drinks .menu-grid", selectId: "drink", label: "Выберите напиток" },
        dessert: { sectionSelector: ".desserts .menu-grid", selectId: "dessert", label: "Выберите десерт" }
    };

    // Сортируем весь массив по name (алфавитно)
    const sortedDishes = [...normalizedData].sort((a, b) => a.name.localeCompare(b.name, "ru"));

    console.log('Отсортированные блюда:', sortedDishes);

    // Проходим по категориям
    Object.keys(mapping).forEach(cat => {
        const conf = mapping[cat];
        const container = document.querySelector(conf.sectionSelector);
        const select = document.getElementById(conf.selectId);

        if (!container) {
            console.warn(`Контейнер не найден: ${conf.sectionSelector}`);
            return;
        }
        if (!select) {
            console.warn(`Select не найден: ${conf.selectId}`);
            return;
        }

        // Очищаем контейнер и select (сохраняем плейсхолдер)
        container.innerHTML = "";
        select.innerHTML = `<option value="">${conf.label}</option>`;

        // Фильтруем блюда данной категории
        const items = sortedDishes.filter(d => d.category === cat);
        
        console.log(`Категория ${cat}: найдено ${items.length} блюд`, items);

        if (items.length === 0) {
            console.warn(`Нет блюд в категории: ${cat}`);
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Блюда временно недоступны';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#999';
            container.appendChild(emptyMessage);
        }

        items.forEach(dish => {
            // Добавляем опцию в select (value = keyword)
            const opt = document.createElement("option");
            opt.value = dish.keyword;
            opt.textContent = `${dish.name} — ${dish.price} ₽`;
            select.appendChild(opt);

            // Создаем карточку блюда
            const card = document.createElement("div");
            card.className = "dish-card";
            card.setAttribute("data-dish", dish.keyword);
            card.setAttribute("data-category", dish.category);
            card.setAttribute("data-kind", dish.kind);

            card.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}" onerror="this.src='placeholder.jpg'">
                <p class="price">${dish.price} ₽</p>
                <p class="name">${dish.name}</p>
                <p class="weight">${dish.count}</p>
                <button type="button">Добавить</button>
            `;

            container.appendChild(card);
        });
        
        console.log(`Отрендерено ${items.length} блюд в категории ${cat}`);
    });

    // Инициализируем фильтры после рендеринга
    if (window.initFilters) {
        setTimeout(() => {
            window.initFilters();
        }, 100);
    }
    
    // Сохраняем функцию для глобального доступа
    window.renderDishes = function() {
        renderDishes(normalizedData);
    };
    
    // Сохраняем данные для использования в других модулях
    window.dishesData = normalizedData;

    // ИНИЦИАЛИЗИРУЕМ ФИЛЬТРЫ ПОСЛЕ РЕНДЕРА
    if (window.initFiltersAfterLoad) {
        window.initFiltersAfterLoad();
    }
}