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
    
    cards.forEach(card => {
      const dishKind = card.dataset.kind;
      
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
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.closest('section').className.split(' ')[0];
        const kind = button.dataset.kind;
        handleFilterClick(category, button, kind);
      });
    });
  }

  // Добавляем data-kind к карточкам при рендере
  const originalRender = window.renderDishes;
  window.renderDishes = function() {
    if (typeof originalRender === 'function') {
      originalRender();
    }
    
    // Добавляем data-kind к уже отрендеренным карточкам
    dishes.forEach(dish => {
      const card = document.querySelector(`[data-dish="${dish.keyword}"]`);
      if (card) {
        card.setAttribute('data-kind', dish.kind);
      }
    });
    
    initFilters();
  };

  // Инициализируем при загрузке
  window.renderDishes();
});