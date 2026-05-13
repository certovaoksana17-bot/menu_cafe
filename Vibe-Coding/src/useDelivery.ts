// ─────────────────────────────────────────────
// useDelivery.ts — хук логики доставки
//
// Принимает subtotal (сумму блюд) и возвращает
// всё нужное для блока доставки в корзине:
// выбор режима, адрес, валидацию, стоимость.
// ─────────────────────────────────────────────

import { useState } from "react";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_FROM,
  validateAddress,
} from "./utils";

// Два режима получения заказа
export type DeliveryMode = "pickup" | "delivery";

// ── Сам хук ───────────────────────────────────
// subtotal — сумма блюд без учёта доставки
export function useDelivery(subtotal: number) {
  // Выбранный способ получения
  const [mode, setMode] = useState<DeliveryMode>("pickup");

  // Адрес доставки (используется только в режиме "delivery")
  const [address, setAddress] = useState("");

  // true — пользователь уже покинул поле хотя бы раз.
  // Ошибки показываем только после этого, чтобы не раздражать при вводе.
  const [addressTouched, setAddressTouched] = useState(false);

  // Текущая ошибка (null = адрес валиден)
  const addressError = validateAddress(address);
  const addressValid = addressError === null;

  // Стоимость доставки:
  // — самовывоз → 0 ₽
  // — доставка + сумма >= FREE_DELIVERY_FROM → 0 ₽ (бесплатно)
  // — доставка + сумма < FREE_DELIVERY_FROM  → DELIVERY_FEE ₽
  const deliveryFee =
    mode === "pickup"
      ? 0
      : subtotal >= FREE_DELIVERY_FROM
        ? 0
        : DELIVERY_FEE;

  // Итоговая сумма включает стоимость доставки
  const total = subtotal + deliveryFee;

  // Заказ можно оформить только если:
  // — самовывоз (адрес не нужен), или
  // — доставка и адрес прошёл валидацию
  const canOrder = mode === "pickup" || addressValid;

  // При переключении на самовывоз сбрасываем состояние поля адреса
  function switchMode(newMode: DeliveryMode) {
    setMode(newMode);
    if (newMode === "pickup") {
      setAddressTouched(false);
    }
  }

  return {
    mode,
    switchMode,
    address,
    setAddress,
    addressTouched,
    setAddressTouched,
    addressError,
    addressValid,
    deliveryFee,
    total,
    canOrder,
  };
}
