// render.js
document.addEventListener("DOMContentLoaded", async () => {
    let dishesData = [];
    
    try {
        dishesData = await loadDishes();
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        dishesData = dishes;
    }

    renderDishes(dishesData);
    populateOrderSelects(dishesData);
    
    // Инициализируем фильтры после загрузки данных
    if (window.initFiltersAfterLoad) {
        window.initFiltersAfterLoad();
    }
});

function renderDishes(dishesData) {
    const mapping = {
        soup:  { sectionSelector: ".soups .menu-grid" },
        main:  { sectionSelector: ".mains .menu-grid" },
        salad: { sectionSelector: ".salads .menu-grid" },
        drink: { sectionSelector: ".drinks .menu-grid" },
        dessert: { sectionSelector: ".desserts .menu-grid" }
    };

    const sortedDishes = [...dishesData].sort((a, b) => a.name.localeCompare(b.name, "ru"));

    Object.keys(mapping).forEach(cat => {
        const conf = mapping[cat];
        const container = document.querySelector(conf.sectionSelector);

        if (!container) return;

        container.innerHTML = "";

        // Исправляем фильтрацию для главных блюд
        let items;
        if (cat === 'main') {
            items = sortedDishes.filter(d => d.category === 'main-course');
        } else {
            items = sortedDishes.filter(d => d.category === cat);
        }

        items.forEach(dish => {
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
    });

    window.renderDishes = function() {};
    window.dishesData = dishesData;
}

// Функция для заполнения выпадающих списков в форме заказа
function populateOrderSelects(dishesData) {
    const categories = {
        'soup': 'Супы',
        'main': 'Главные блюда', 
        'salad': 'Салаты',
        'drink': 'Напитки',
        'dessert': 'Десерты'
    };

    Object.keys(categories).forEach(category => {
        const select = document.getElementById(category);
        if (!select) return;

        // Очищаем существующие опции (кроме первой)
        select.innerHTML = '<option value="" selected>Выберите ' + categories[category].toLowerCase() + '</option>';

        // Фильтруем блюда по категории (исправляем для главных блюд)
        let categoryDishes;
        if (category === 'main') {
            categoryDishes = dishesData.filter(dish => dish.category === 'main-course');
        } else {
            categoryDishes = dishesData.filter(dish => dish.category === category);
        }
        
        // Сортируем по имени и добавляем в select
        categoryDishes.sort((a, b) => a.name.localeCompare(b.name, "ru"))
            .forEach(dish => {
                const option = document.createElement('option');
                option.value = dish.keyword;
                option.textContent = `${dish.name} - ${dish.price} ₽`;
                option.dataset.price = dish.price;
                select.appendChild(option);
            });
    });
}