// js/order.js
document.addEventListener("DOMContentLoaded", () => {
// состояние заказа (глобальное для доступа из validation.js)
window.order = { 
    soup: null, 
    main: null, 
    salad: null,
    drink: null, 
    dessert: null 
};
const order = window.order; // для обратной совместимости

  // элементы формы / UI
  const form = document.querySelector('form[action="https://httpbin.org/post"]') || document.querySelector('form');
  const selectSoup  = document.getElementById('soup');
  const selectMain  = document.getElementById('main');
  const selectSalad = document.getElementById('salad');
  const selectDrink = document.getElementById('drink');
  const selectDessert = document.getElementById('dessert');
  const totalEl = document.querySelector('.total-price');

  function findDishByKeyword(key) {
    return dishes.find(d => d.keyword === key) || null;
  }

  function clearCardSelection(category) {
    document.querySelectorAll(`.dish-card[data-category="${category}"]`).forEach(el => el.classList.remove('selected'));
  }

  function highlightCardFor(category, keyword) {
    clearCardSelection(category);
    if (!keyword) return;
    const card = document.querySelector(`.dish-card[data-dish="${keyword}"]`);
    if (card) card.classList.add('selected');
  }

  function updateSelectPlaceholder(select, selectedDish, defaultText, emptyText) {
    if (!select) return;
    const firstOption = select.querySelector("option");

    if (selectedDish) {
      select.value = selectedDish.keyword;
      firstOption.textContent = defaultText;
    } else {
      const somethingChosen = Object.values(order).some(item => item !== null);
      firstOption.textContent = somethingChosen ? emptyText : defaultText;
      select.value = "";
    }
  }

  function updateTotalAndUI() {
    // Обновляем селекты
    updateSelectPlaceholder(selectSoup, order.soup, "Выберите суп", "Суп не выбран");
    updateSelectPlaceholder(selectMain, order.main, "Выберите главное блюдо", "Главное блюдо не выбрано");
    updateSelectPlaceholder(selectSalad, order.salad, "Выберите салат или стартер", "Салат не выбран");
    updateSelectPlaceholder(selectDrink, order.drink, "Выберите напиток", "Напиток не выбран");
    updateSelectPlaceholder(selectDessert, order.dessert, "Выберите десерт", "Десерт не выбран");

    // Подсчёт стоимости
    const items = Object.values(order).filter(Boolean);
    const total = items.reduce((s, it) => s + (it.price || 0), 0);

    if (!totalEl) return;
    if (total > 0) {
      totalEl.textContent = `Стоимость заказа: ${total} ₽`;
      totalEl.style.display = "block";
    } else {
      totalEl.textContent = "";
      totalEl.style.display = "none";
    }

    // Выделение активных карточек
    Object.keys(order).forEach(cat => {
      const obj = order[cat];
      highlightCardFor(cat, obj ? obj.keyword : null);
    });
  }

  // Нажатие на кнопку "Добавить" в карточке
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.dish-card button');
    if (!btn) return;
    const card = btn.closest('.dish-card');
    if (!card) return;
    const kw = card.dataset.dish;
    const dish = findDishByKeyword(kw);
    if (!dish) return;

    order[dish.category] = dish;
    updateTotalAndUI();
  });

  // Обработчики изменения селектов
  const selectHandlers = {
    soup: selectSoup,
    main: selectMain,
    salad: selectSalad,
    drink: selectDrink,
    dessert: selectDessert
  };

  Object.entries(selectHandlers).forEach(([category, select]) => {
    if (select) {
      select.addEventListener('change', (e) => {
        order[category] = e.target.value ? findDishByKeyword(e.target.value) : null;
        updateTotalAndUI();
      });
    }
  });

  // Событие reset формы
  if (form) {
    form.addEventListener('reset', () => {
      setTimeout(() => {
        Object.keys(order).forEach(key => order[key] = null);
        Object.keys(order).forEach(cat => clearCardSelection(cat));
        updateTotalAndUI();
      }, 0);
    });
  }

  // Инициализация UI
  updateTotalAndUI();
});