// ─────────────────────────────────────────────
// data.ts — данные меню
// Чтобы добавить новое блюдо — добавьте объект
// в нужную категорию ниже.
// ─────────────────────────────────────────────

// КБЖУ на порцию
export type Nutrition = {
  calories: number;  // ккал
  protein: number;   // г белка
  fat: number;       // г жиров
  carbs: number;     // г углеводов
  weight: number;    // г — вес порции
};

// Тип одного блюда
export type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;        // цена в рублях
  photo: string;        // URL изображения
  category: string;     // должен совпадать с Category.id
  ingredients: string;  // состав через запятую
  nutrition: Nutrition;
  allergens: string[];  // список аллергенов
};

// Тип категории
export type Category = {
  id: string;   // уникальный ключ, используется для фильтрации
  label: string; // человекочитаемое название
};

// ─── Список категорий ────────────────────────
export const CATEGORIES: Category[] = [
  { id: "all",       label: "Всё меню" },
  { id: "burgers",   label: "Бургеры" },
  { id: "pizza",     label: "Пицца" },
  { id: "salads",    label: "Салаты" },
  { id: "drinks",    label: "Напитки" },
];

// ─── Список блюд ─────────────────────────────
export const DISHES: Dish[] = [
  {
    id: 1,
    name: "Классик Бургер",
    description: "Сочная говяжья котлета, хрустящий салат, томат и фирменный соус",
    price: 299,
    photo: "https://placehold.co/600x400",
    category: "burgers",
    ingredients: "Булочка пшеничная, говяжья котлета (говядина 100%), салат айсберг, томат, лук, фирменный соус (майонез, кетчуп, горчица, специи), соль, перец",
    nutrition: { calories: 520, protein: 28, fat: 24, carbs: 48, weight: 230 },
    allergens: ["Глютен", "Яйцо", "Горчица"],
  },
  {
    id: 2,
    name: "Чизбургер",
    description: "Говядина, двойной чеддер, маринованный огурец и горчица",
    price: 329,
    photo: "https://placehold.co/600x400",
    category: "burgers",
    ingredients: "Булочка пшеничная, говяжья котлета (говядина 100%), сыр чеддер (×2), маринованный огурец, лук репчатый, горчица, кетчуп, соль, перец",
    nutrition: { calories: 610, protein: 34, fat: 31, carbs: 46, weight: 250 },
    allergens: ["Глютен", "Молоко", "Горчица"],
  },
  {
    id: 3,
    name: "Острый Чикен",
    description: "Хрустящая куриная котлета, острый соус, салат айсберг, маринованный халапеньо",
    price: 279,
    photo: "https://placehold.co/600x400",
    category: "burgers",
    ingredients: "Булочка пшеничная, куриная котлета в панировке (курица 80%, мука, яйцо, специи), острый соус чили, салат айсберг, халапеньо маринованный, соль",
    nutrition: { calories: 490, protein: 26, fat: 20, carbs: 50, weight: 215 },
    allergens: ["Глютен", "Яйцо"],
  },
  {
    id: 4,
    name: "Маргарита",
    description: "Томатный соус, моцарелла, свежий базилик, оливковое масло",
    price: 459,
    photo: "https://placehold.co/600x400",
    category: "pizza",
    ingredients: "Тесто дрожжевое (мука пшеничная, вода, дрожжи, соль, сахар, масло), томатный соус (томаты, чеснок, орегано), моцарелла, базилик свежий, оливковое масло",
    nutrition: { calories: 720, protein: 30, fat: 22, carbs: 96, weight: 380 },
    allergens: ["Глютен", "Молоко"],
  },
  {
    id: 5,
    name: "Пепперони",
    description: "Томатный соус, моцарелла, острое пепперони",
    price: 499,
    photo: "https://placehold.co/600x400",
    category: "pizza",
    ingredients: "Тесто дрожжевое (мука пшеничная, вода, дрожжи, соль, сахар, масло), томатный соус (томаты, чеснок, орегано), моцарелла, колбаса пепперони (свинина, говядина, специи, нитрит натрия)",
    nutrition: { calories: 850, protein: 36, fat: 35, carbs: 94, weight: 400 },
    allergens: ["Глютен", "Молоко"],
  },
  {
    id: 6,
    name: "Четыре сыра",
    description: "Моцарелла, чеддер, пармезан, горгонзола",
    price: 529,
    photo: "https://placehold.co/600x400",
    category: "pizza",
    ingredients: "Тесто дрожжевое (мука пшеничная, вода, дрожжи, соль, сахар, масло), сливочный соус (сливки, чеснок), моцарелла, чеддер, пармезан, горгонзола",
    nutrition: { calories: 920, protein: 42, fat: 44, carbs: 88, weight: 410 },
    allergens: ["Глютен", "Молоко"],
  },
  {
    id: 7,
    name: "Цезарь с курицей",
    description: "Листья романо, жареная курица, пармезан, крутоны, соус Цезарь",
    price: 349,
    photo: "https://placehold.co/600x400",
    category: "salads",
    ingredients: "Листья романо, куриное филе жареное (курица, соль, перец, масло), пармезан тёртый, крутоны пшеничные, соус Цезарь (майонез, анчоусы, лимон, чеснок, горчица, вустерский соус)",
    nutrition: { calories: 380, protein: 32, fat: 18, carbs: 22, weight: 290 },
    allergens: ["Глютен", "Молоко", "Яйцо", "Рыба", "Горчица"],
  },
  {
    id: 8,
    name: "Греческий",
    description: "Огурец, томаты, перец, маслины, фета, оливковое масло",
    price: 289,
    photo: "https://placehold.co/600x400",
    category: "salads",
    ingredients: "Огурец свежий, томаты черри, перец болгарский, маслины без косточек, сыр фета, красный лук, оливковое масло, орегано, соль, перец чёрный",
    nutrition: { calories: 210, protein: 7, fat: 16, carbs: 11, weight: 260 },
    allergens: ["Молоко"],
  },
  {
    id: 9,
    name: "Лимонад Клубника",
    description: "Свежевыжатый лимон, клубника, мята, газированная вода",
    price: 179,
    photo: "https://placehold.co/600x400",
    category: "drinks",
    ingredients: "Газированная вода, клубника свежая, сок лимона свежевыжатый, сахарный сироп, мята свежая, лёд",
    nutrition: { calories: 95, protein: 0, fat: 0, carbs: 23, weight: 400 },
    allergens: [],
  },
  {
    id: 10,
    name: "Молочный Шейк Ваниль",
    description: "Цельное молоко, мороженое, ваниль",
    price: 199,
    photo: "https://placehold.co/600x400",
    category: "drinks",
    ingredients: "Молоко цельное 3,2%, мороженое пломбир (молоко, сахар, сливки, яйцо, ваниль), ваниль натуральная, сахар",
    nutrition: { calories: 360, protein: 9, fat: 14, carbs: 50, weight: 350 },
    allergens: ["Молоко", "Яйцо"],
  },
  {
    id: 11,
    name: "Американо",
    description: "Двойной эспрессо, горячая вода. Зерно обжарки из Эфиопии",
    price: 149,
    photo: "https://placehold.co/600x400",
    category: "drinks",
    ingredients: "Кофе молотый (зерно Arabica Эфиопия, обжарка средняя), вода очищенная",
    nutrition: { calories: 10, protein: 0, fat: 0, carbs: 2, weight: 250 },
    allergens: [],
  },
];
