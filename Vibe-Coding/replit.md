# FastBite — Интерактивное меню кафе

Минималистичное интерактивное меню для кафе быстрого обслуживания с фильтрацией по категориям и поиском.

## Запуск

```bash
# Запуск приложения в режиме разработки
pnpm --filter @workspace/cafe-menu run dev
```

Приложение откроется по адресу, который укажет терминал (обычно http://localhost:PORT).

## Структура файлов (всего 4 файла)

```
artifacts/cafe-menu/src/
├── main.tsx      — точка входа, монтирует React
├── App.tsx       — весь интерфейс: шапка, фильтры, сетка карточек
├── data.ts       — данные меню (блюда и категории)
└── index.css     — все стили
```

## Как расширить

### Добавить блюдо
Откройте `src/data.ts` и добавьте объект в массив `DISHES`:
```ts
{
  id: 12,
  name: "Новое блюдо",
  description: "Описание",
  price: 199,
  photo: "https://...",
  category: "burgers", // id из CATEGORIES
}
```

### Добавить категорию
В `src/data.ts` добавьте в `CATEGORIES`:
```ts
{ id: "sushi", label: "Суши" }
```
Затем добавьте блюда с `category: "sushi"`.

### Изменить цвета
В `src/index.css` в блоке `:root` измените переменные:
```css
--color-accent: #ff3d00;  /* основной акцентный цвет */
```

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite
- Чистый CSS (без UI-фреймворков)

## User preferences

- Код должен быть понятным новичку: не более 3–5 файлов, комментарии в коде
- Без сложных паттернов и лишних библиотек

## Gotchas

- После изменения `data.ts` перезагрузка происходит автоматически (hot reload)
- Фото берутся с Unsplash — нужен интернет для отображения

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
