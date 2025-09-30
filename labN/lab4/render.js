// js/render.js
document.addEventListener("DOMContentLoaded", () => {
  // Категории и соответствующие селект/контейнеры
  const mapping = {
    soup:  { sectionSelector: ".soups .menu-grid", selectId: "soup", label: "Выберите суп" },
    main:  { sectionSelector: ".mains .menu-grid", selectId: "main", label: "Выберите главное блюдо" },
    drink: { sectionSelector: ".drinks .menu-grid", selectId: "drink", label: "Выберите напиток" }
  };

  // Сортируем весь массив по name (алфавитно)
  dishes.sort((a, b) => a.name.localeCompare(b.name, "ru"));

  // Проходим по категориям
  Object.keys(mapping).forEach(cat => {
    const conf = mapping[cat];
    const container = document.querySelector(conf.sectionSelector);
    const select = document.getElementById(conf.selectId);

    if (!container) return;
    if (!select) return;

    // Очищаем контейнер и select (сохраняем плейсхолдер)
    container.innerHTML = "";
    select.innerHTML = `<option value="">${conf.label}</option>`;

    // Фильтруем и сортируем блюда данной категории
    const items = dishes.filter(d => d.category === cat).sort((a,b)=> a.name.localeCompare(b.name, "ru"));

    items.forEach(dish => {
      // Добавляем опцию в select (value = keyword)
      const opt = document.createElement("option");
      opt.value = dish.keyword;
      opt.textContent = `${dish.name} — ${dish.price} ₽`; // название + цена
      select.appendChild(opt);


      // Создаем карточку блюда
      const card = document.createElement("div");
      card.className = "dish-card";
      card.setAttribute("data-dish", dish.keyword);
      card.setAttribute("data-category", dish.category);

      card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button type="button">Добавить</button>
      `;

      container.appendChild(card);
    });
  });
});
