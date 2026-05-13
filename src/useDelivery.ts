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

// ── Безопасная обёртка validateAddress ────────
// Защищает от двух рисков:
// 1. validateAddress бросит исключение (try/catch)
// 2. вернёт неожиданный тип вместо string | null
function safeValidateAddress(value: string): string | null {
  try {
    const result = validateAddress(value);
    if (result === null || typeof result === "string") return result;
    return "Ошибка проверки адреса";
  } catch {
    return "Ошибка проверки адреса";
  }
}

// ── Сам хук ───────────────────────────────────
// subtotal — сумма блюд без учёта доставки
export function useDelivery(subtotal: number) {
  // ── Состояние ─────────────────────────────
  const [mode, setMode] = useState<DeliveryMode>("pickup");
  const [address, setAddress] = useState("");
  // true — пользователь уже покинул поле хотя бы раз.
  // Ошибки показываем только после этого, чтобы не раздражать при вводе.
  const [addressTouched, setAddressTouched] = useState(false);

  // ── Валидация ─────────────────────────────
  // Обёрнуто в safeValidateAddress — не упадёт при неожиданной ошибке
  const addressError = safeValidateAddress(address);
  const addressValid = addressError === null;

  // ── Расчёт стоимости ──────────────────────
  // самовывоз → 0 ₽
  // доставка + сумма >= FREE_DELIVERY_FROM → 0 ₽ (бесплатно)
  // доставка + сумма < FREE_DELIVERY_FROM  → DELIVERY_FEE ₽
  const deliveryFee =
    mode === "pickup"
      ? 0
      : subtotal >= FREE_DELIVERY_FROM
        ? 0
        : DELIVERY_FEE;

  const total = subtotal + deliveryFee;

  // ── Разрешение на заказ ───────────────────
  // самовывоз — адрес не нужен
  // доставка — адрес должен пройти валидацию
  const canOrder = mode === "pickup" || addressValid;

  // ── Переключение режима ───────────────────
  // Сбрасывает адрес и состояние поля при любом переключении.
  // Это предотвращает ситуацию, когда старый адрес остаётся
  // после переключения туда-обратно и уходит в заказ незаметно.
  function switchMode(newMode: DeliveryMode) {
    setMode(newMode);
    setAddress("");
    setAddressTouched(false);
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
