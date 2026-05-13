// ─────────────────────────────────────────────
// useCart.ts — хук управления корзиной
//
// Хук — это обычная функция, которая использует
// useState внутри себя. Компонент вызывает хук
// и получает готовые данные и действия.
//
// Вся логика корзины здесь, UI — в App.tsx.
// ─────────────────────────────────────────────

import { useState } from "react";
import { type Dish } from "./data";
import { MAX_QTY } from "./utils";

// Тип одной позиции в корзине
export type CartItem = {
  dish: Dish;
  qty: number;
};

// ── Сам хук ───────────────────────────────────
export function useCart() {
  // Массив позиций в корзине
  const [cart, setCart] = useState<CartItem[]>([]);

  // Общее количество единиц (для бейджа на кнопке корзины)
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Добавить блюдо в корзину или увеличить количество
  function addToCart(dish: Dish) {
    setCart((prev) => {
      const exists = prev.find((item) => item.dish.id === dish.id);
      if (exists) {
        // Блюдо уже есть — не превышаем MAX_QTY
        if (exists.qty >= MAX_QTY) return prev;
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      // Новая позиция — добавляем с qty = 1
      return [...prev, { dish, qty: 1 }];
    });
  }

  // Изменить количество блюда на delta (+1 или -1)
  // qty зажимается в [0, MAX_QTY]; при 0 — позиция удаляется
  function changeQty(dishId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.dish.id !== dishId) return item;
          const newQty = Math.min(MAX_QTY, Math.max(0, item.qty + delta));
          return { ...item, qty: newQty };
        })
        .filter((item) => item.qty > 0) // qty = 0 → убираем позицию
    );
  }

  // Полностью удалить блюдо из корзины
  function removeFromCart(dishId: number) {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  }

  return { cart, totalQty, addToCart, changeQty, removeFromCart };
}
