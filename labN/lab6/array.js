// js/array.js
const dishes = [
  // Супы (6 блюд: 2 рыбных, 2 мясных, 2 вегетарианских)
  {
    keyword: 'fish-soup-1',
    name: 'Рыбный суп',
    price: 195,
    category: 'soup',
    count: '350 г',
    image: 'soup1.jpg',
    kind: 'fish'
  },
  {
    keyword: 'fish-soup-2',
    name: 'Уха по-фински',
    price: 220,
    category: 'soup',
    count: '380 г',
    image: 'soup2.jpg',
    kind: 'fish'
  },
  {
    keyword: 'meat-soup-1',
    name: 'Куриный суп',
    price: 185,
    category: 'soup',
    count: '350 г',
    image: 'soup3.jpg',
    kind: 'meat'
  },
  {
    keyword: 'meat-soup-2',
    name: 'Солянка мясная',
    price: 210,
    category: 'soup',
    count: '370 г',
    image: 'soup4.webp',
    kind: 'meat'
  },
  {
    keyword: 'veg-soup-1',
    name: 'Гаспачо',
    price: 175,
    category: 'soup',
    count: '300 г',
    image: 'soup5.jpeg',
    kind: 'veg'
  },
  {
    keyword: 'veg-soup-2',
    name: 'Овощной крем-суп',
    price: 160,
    category: 'soup',
    count: '320 г',
    image: 'soup6.jpg',
    kind: 'veg'
  },

  // Главные блюда (6 блюд: 2 рыбных, 2 мясных, 2 вегетарианских)
  {
    keyword: 'fish-main-1',
    name: 'Рыбная котлета с рисом',
    price: 450,
    category: 'main',
    count: '280 г',
    image: 'main1.jpeg',
    kind: 'fish'
  },
  {
    keyword: 'fish-main-2',
    name: 'Лосось на гриле',
    price: 520,
    category: 'main',
    count: '300 г',
    image: 'main2.jpg',
    kind: 'fish'
  },
  {
    keyword: 'meat-main-1',
    name: 'Курица гриль',
    price: 370,
    category: 'main',
    count: '300 г',
    image: 'main3.jpg',
    kind: 'meat'
  },
  {
    keyword: 'meat-main-2',
    name: 'Говядина с овощами',
    price: 480,
    category: 'main',
    count: '320 г',
    image: 'main4.webp',
    kind: 'meat'
  },
  {
    keyword: 'veg-main-1',
    name: 'Лазанья овощная',
    price: 385,
    category: 'main',
    count: '310 г',
    image: 'main5.jpg',
    kind: 'veg'
  },
  {
    keyword: 'veg-main-2',
    name: 'Паста с томатным соусом',
    price: 320,
    category: 'main',
    count: '280 г',
    image: 'main6.jpg',
    kind: 'veg'
  },

  // Салаты и стартеры (6 блюд: 1 рыбный, 1 мясной, 4 вегетарианских)
  {
    keyword: 'fish-salad-1',
    name: 'Салат с тунцом',
    price: 300,
    category: 'salad',
    count: '200 г',
    image: 'salad1.webp',
    kind: 'fish'
  },
  {
    keyword: 'meat-salad-1',
    name: 'Цезарь с курицей',
    price: 350,
    category: 'salad',
    count: '250 г',
    image: 'salad2.webp',
    kind: 'meat'
  },
  {
    keyword: 'veg-salad-1',
    name: 'Греческий салат',
    price: 270,
    category: 'salad',
    count: '220 г',
    image: 'salad3.jpg',
    kind: 'veg'
  },
  {
    keyword: 'veg-salad-2',
    name: 'Салат с овощами и яйцом',
    price: 250,
    category: 'salad',
    count: '230 г',
    image: 'salad4.jpg',
    kind: 'veg'
  },
  {
    keyword: 'veg-salad-3',
    name: 'Морковный салат',
    price: 200,
    category: 'salad',
    count: '180 г',
    image: 'salad5.webp',
    kind: 'veg'
  },
  {
    keyword: 'veg-salad-4',
    name: 'Салат из свежих овощей',
    price: 220,
    category: 'salad',
    count: '200 г',
    image: 'salad6.jpg',
    kind: 'veg'
  },

  // Напитки (6 напитков: 3 холодных, 3 горячих)
  {
    keyword: 'cold-drink-1',
    name: 'Компот',
    price: 100,
    category: 'drink',
    count: '300 мл',
    image: 'drink1.jpg',
    kind: 'cold'
  },
  {
    keyword: 'cold-drink-2',
    name: 'Лимонад',
    price: 120,
    category: 'drink',
    count: '330 мл',
    image: 'drink2.jpg',
    kind: 'cold'
  },
  {
    keyword: 'cold-drink-3',
    name: 'Сок апельсиновый',
    price: 90,
    category: 'drink',
    count: '250 мл',
    image: 'drink3.jpg',
    kind: 'cold'
  },
  {
    keyword: 'hot-drink-1',
    name: 'Черный чай',
    price: 70,
    category: 'drink',
    count: '300 мл',
    image: 'drink4.jpg',
    kind: 'hot'
  },
  {
    keyword: 'hot-drink-2',
    name: 'Зеленый чай',
    price: 80,
    category: 'drink',
    count: '300 мл',
    image: 'drink5.avif',
    kind: 'hot'
  },
  {
    keyword: 'hot-drink-3',
    name: 'Кофе американо',
    price: 110,
    category: 'drink',
    count: '200 мл',
    image: 'drink6.webp',
    kind: 'hot'
  },

  // Десерты (6 десертов: 3 маленьких, 2 средних, 1 большой)
  {
    keyword: 'small-dessert-1',
    name: 'Тирамису',
    price: 220,
    category: 'dessert',
    count: '115 г',
    image: 'dessert1.webp',
    kind: 'small'
  },
  {
    keyword: 'small-dessert-2',
    name: 'Чизкейк',
    price: 240,
    category: 'dessert',
    count: '120 г',
    image: 'dessert2.jpg',
    kind: 'small'
  },
  {
    keyword: 'small-dessert-3',
    name: 'Шоколадный мусс',
    price: 200,
    category: 'dessert',
    count: '100 г',
    image: 'dessert3.jpg',
    kind: 'small'
  },
  {
    keyword: 'medium-dessert-1',
    name: 'Шоколадный торт',
    price: 270,
    category: 'dessert',
    count: '140 г',
    image: 'dessert4.jpg',
    kind: 'medium'
  },
  {
    keyword: 'medium-dessert-2',
    name: 'Яблочный пирог',
    price: 190,
    category: 'dessert',
    count: '150 г',
    image: 'dessert5.jpg',
    kind: 'medium'
  },
  {
    keyword: 'large-dessert-1',
    name: 'Фруктовая тарелка',
    price: 350,
    category: 'dessert',
    count: '300 г',
    image: 'dessert6.webp',
    kind: 'large'
  }
];