// js/order.js
document.addEventListener("DOMContentLoaded", () => {
  // состояние заказа
  const order = { soup: null, main: null, drink: null };

  // элементы формы / UI
  const form = document.querySelector('form[action="https://httpbin.org/post"]') || document.querySelector('form');
  const selectSoup  = document.getElementById('soup');
  const selectMain  = document.getElementById('main');
  const selectDrink = document.getElementById('drink');
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

  // Функция обновления текста первой опции
function updateSelectPlaceholder(select, selectedDish, defaultText, emptyText) {
  if (!select) return;
  const firstOption = select.querySelector("option");

  if (selectedDish) {
    // Если блюдо выбрано — показываем его, а первая опция стандартная
    select.value = selectedDish.keyword;
    firstOption.textContent = defaultText;
  } else {
    // Если ничего не выбрано — проверяем, выбран ли хотя бы один элемент в заказе
    const somethingChosen = order.soup || order.main || order.drink;

    if (somethingChosen) {
      firstOption.textContent = emptyText; // "Суп не выбран"
    } else {
      firstOption.textContent = defaultText; // "Выберите суп"
    }
    select.value = ""; // остаётся пустым
  }
}

// Вызываем для каждого select
updateSelectPlaceholder(selectSoup, order.soup, "Выберите суп", "Блюдо не выбрано");
updateSelectPlaceholder(selectMain, order.main, "Выберите главное блюдо", "Блюдо не выбрано");
updateSelectPlaceholder(selectDrink, order.drink, "Выберите напиток", "Напиток не выбран");


  function updateTotalAndUI() {
  // === 1. Обновляем селекты и их плейсхолдеры ===
  updateSelectPlaceholder(selectSoup, order.soup, "Выберите суп", "Блюдо не выбрано");
  updateSelectPlaceholder(selectMain, order.main, "Выберите главное блюдо", "Блюдо не выбрано");
  updateSelectPlaceholder(selectDrink, order.drink, "Выберите напиток", "Напиток не выбран");

  // === 2. Подсчёт стоимости ===
  const items = [order.soup, order.main, order.drink].filter(Boolean);
  const total = items.reduce((s, it) => s + (it.price || 0), 0);

  if (!totalEl) return;
  if (total > 0) {
    totalEl.textContent = `Стоимость заказа: ${total} ₽`;
    totalEl.style.display = "block";
  } else {
    totalEl.textContent = "";
    totalEl.style.display = "none";
  }

  // === 3. Выделение активных карточек ===
  ['soup','main','drink'].forEach(cat => {
    const obj = order[cat];
    highlightCardFor(cat, obj ? obj.keyword : null);
  });
  }


  // Нажатие на кнопку "Добавить" в карточке — делегированно
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.dish-card button');
    if (!btn) return;
    const card = btn.closest('.dish-card');
    if (!card) return;
    const kw = card.dataset.dish;
    const dish = findDishByKeyword(kw);
    if (!dish) return;

    // Записываем в состояние и обновляем UI
    order[dish.category] = dish;
    updateTotalAndUI();

    // Чтобы пользователь видел, что он добавил — можно прокрутить к форме (опционально)
    // document.querySelector('.order-title')?.scrollIntoView({ behavior: "smooth" });
  });

  // Обработчики изменения селектов (ручной выбор)
  if (selectSoup) {
    selectSoup.addEventListener('change', (e) => {
      order.soup = e.target.value ? findDishByKeyword(e.target.value) : null;
      updateTotalAndUI();
    });
  }
  if (selectMain) {
    selectMain.addEventListener('change', (e) => {
      order.main = e.target.value ? findDishByKeyword(e.target.value) : null;
      updateTotalAndUI();
    });
  }
  if (selectDrink) {
    selectDrink.addEventListener('change', (e) => {
      order.drink = e.target.value ? findDishByKeyword(e.target.value) : null;
      updateTotalAndUI();
    });
  }

  // Событие reset формы — после сброса (setTimeout, чтобы значения уже вернулись к дефолтным)
  if (form) {
    form.addEventListener('reset', () => {
      // сбрасываем состояние, но делаем это после фактического сброса DOM (через 0ms)
      setTimeout(() => {
        order.soup = order.main = order.drink = null;
        // снять выделения
        ['soup','main','drink'].forEach(cat => clearCardSelection(cat));
        updateTotalAndUI();
      }, 0);
    });
  }

  // Инициализация UI (скроем total, выставим начальное состояние)
  updateTotalAndUI();
});
