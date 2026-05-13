// ─────────────────────────────────────────────
// App.tsx — только UI и склейка компонентов
//
// Логика вынесена в отдельные файлы:
//   useCart.ts    — корзина (добавить, удалить, изменить кол-во)
//   useDelivery.ts — доставка (режим, адрес, стоимость)
//   utils.ts      — форматирование цен, валидация, константы
// ─────────────────────────────────────────────

import { useState } from "react";
import { CATEGORIES, DISHES, type Dish } from "./data";
import { useCart, type CartItem } from "./useCart";
import { useDelivery, type DeliveryMode } from "./useDelivery";
import {
  formatPrice,
  MAX_QTY,
  DELIVERY_FEE,
  FREE_DELIVERY_FROM,
  DELIVERY_TIME,
  PICKUP_TIME,
} from "./utils";

// ─── Заглушка при ошибке загрузки фото ───────
function FallbackPhoto({ alt, className }: { alt: string; className: string }) {
  return (
    <div className={`${className} img-fallback`} title={alt}>
      <span className="img-fallback__icon">🍽</span>
      <span className="img-fallback__text">Фото недоступно</span>
    </div>
  );
}

// Пробует загрузить фото — при ошибке показывает FallbackPhoto
function DishPhoto({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) return <FallbackPhoto alt={alt} className={className} />;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}

// ─── Панель корзины ───────────────────────────
function CartPanel({
  cart,
  onClose,
  onChangeQty,
  onRemove,
}: {
  cart: CartItem[];
  onClose: () => void;
  onChangeQty: (dishId: number, delta: number) => void;
  onRemove: (dishId: number) => void;
}) {
  // Сумма только блюд (без доставки) — нужна хуку useDelivery
  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.qty, 0);

  // Вся логика доставки — в хуке
  const {
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
  } = useDelivery(subtotal);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />

      <aside className="cart-panel">
        <div className="cart-panel__header">
          <h2 className="cart-panel__title">Корзина</h2>
          <button className="cart-panel__close" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty__icon">🛒</span>
            <p>Корзина пуста</p>
            <p>Добавьте что-нибудь из меню</p>
          </div>
        ) : (
          <>
            {/* ── Список блюд ── */}
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.dish.id} className="cart-item">
                  <DishPhoto
                    src={item.dish.photo}
                    alt={item.dish.name}
                    className="cart-item__photo"
                  />

                  <div className="cart-item__info">
                    <span className="cart-item__name">{item.dish.name}</span>
                    <span className="cart-item__unit-price">
                      {formatPrice(item.dish.price)} ₽ / шт.
                    </span>
                  </div>

                  <div className="cart-item__controls">
                    <button className="qty-btn" onClick={() => onChangeQty(item.dish.id, -1)} aria-label="Уменьшить">
                      −
                    </button>
                    <span className="qty-value">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onChangeQty(item.dish.id, +1)}
                      disabled={item.qty >= MAX_QTY}
                      aria-label="Увеличить"
                      title={item.qty >= MAX_QTY ? `Максимум ${MAX_QTY} шт.` : undefined}
                    >
                      +
                    </button>
                  </div>

                  <span className="cart-item__subtotal">
                    {formatPrice(item.dish.price * item.qty)} ₽
                  </span>

                  <button className="cart-item__remove" onClick={() => onRemove(item.dish.id)} aria-label="Удалить">
                    🗑
                  </button>
                </li>
              ))}
            </ul>

            {/* ── Подвал: доставка + итог + кнопка ── */}
            <div className="cart-footer">

              {/* Переключатель Самовывоз / Доставка */}
              <div className="delivery-toggle">
                <button
                  className={`delivery-tab ${mode === "pickup" ? "delivery-tab--active" : ""}`}
                  onClick={() => switchMode("pickup")}
                >
                  🏃 Самовывоз
                </button>
                <button
                  className={`delivery-tab ${mode === "delivery" ? "delivery-tab--active" : ""}`}
                  onClick={() => switchMode("delivery")}
                >
                  🛵 Доставка
                </button>
              </div>

              {/* Блок с временем и адресом */}
              <div className="delivery-info">
                {mode === "pickup" ? (
                  <div className="delivery-time-row">
                    <span className="delivery-time-label">⏱ Время ожидания</span>
                    <span className="delivery-time-value">{PICKUP_TIME}</span>
                  </div>
                ) : (
                  <>
                    <div className="delivery-time-row">
                      <span className="delivery-time-label">⏱ Время доставки</span>
                      <span className="delivery-time-value">{DELIVERY_TIME}</span>
                    </div>

                    {/* Поле адреса с валидацией */}
                    <div className="address-field">
                      <input
                        className={`delivery-address-input ${
                          addressTouched && addressError
                            ? "delivery-address-input--error"
                            : addressTouched && addressValid
                              ? "delivery-address-input--valid"
                              : ""
                        }`}
                        type="text"
                        placeholder="Ул. Ленина, д. 5, кв. 10"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onBlur={() => setAddressTouched(true)}
                        aria-invalid={addressTouched && !!addressError}
                      />
                      {addressTouched && (
                        <span className={`address-field__icon ${addressValid ? "address-field__icon--ok" : "address-field__icon--err"}`}>
                          {addressValid ? "✓" : "!"}
                        </span>
                      )}
                    </div>

                    {addressTouched && addressError && (
                      <p className="address-error">{addressError}</p>
                    )}

                    {(!addressTouched || addressValid) && (
                      <p className="address-hint">Например: ул. Ленина, д. 5, кв. 10</p>
                    )}

                    {subtotal < FREE_DELIVERY_FROM ? (
                      <p className="delivery-fee-hint">
                        Доставка {formatPrice(DELIVERY_FEE)} ₽ · Бесплатно от{" "}
                        {formatPrice(FREE_DELIVERY_FROM)} ₽{" "}
                        <span className="delivery-fee-hint__gap">
                          (ещё {formatPrice(FREE_DELIVERY_FROM - subtotal)} ₽)
                        </span>
                      </p>
                    ) : (
                      <p className="delivery-fee-free">✓ Бесплатная доставка</p>
                    )}
                  </>
                )}
              </div>

              {/* Строки итога */}
              <div className="cart-totals">
                <div className="cart-totals__row">
                  <span>Блюда</span>
                  <span>{formatPrice(subtotal)} ₽</span>
                </div>

                {mode === "delivery" && (
                  <div className="cart-totals__row">
                    <span>Доставка</span>
                    <span className={deliveryFee === 0 ? "delivery-free-label" : ""}>
                      {deliveryFee === 0 ? "Бесплатно" : `${formatPrice(deliveryFee)} ₽`}
                    </span>
                  </div>
                )}

                <div className="cart-footer__total">
                  <span>Итого</span>
                  <span className="cart-footer__sum">{formatPrice(total)} ₽</span>
                </div>
              </div>

              <button
                className="btn-order"
                disabled={!canOrder}
                title={!canOrder ? "Введите адрес доставки" : undefined}
              >
                {canOrder ? "Оформить заказ" : "Введите адрес доставки"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ─── Всплывающее окно блюда ───────────────────
// Показывается поверх всего при клике на карточку
function DishModal({
  dish,
  cartQty,
  onClose,
  onAdd,
  onChangeQty,
}: {
  dish: Dish;
  cartQty: number;
  onClose: () => void;
  onAdd: () => void;
  onChangeQty: (delta: number) => void;
}) {
  const { nutrition, ingredients, allergens } = dish;

  return (
    <>
      {/* Тёмный фон — клик по нему закрывает окно */}
      <div className="modal-overlay" onClick={onClose} />

      <div className="modal" role="dialog" aria-modal="true">
        {/* Кнопка закрытия */}
        <button className="modal__close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>

        {/* Фото */}
        <div className="modal__image-wrap">
          <DishPhoto src={dish.photo} alt={dish.name} className="modal__image" />
        </div>

        {/* Название и описание */}
        <div className="modal__body">
          <h2 className="modal__name">{dish.name}</h2>
          <p className="modal__desc">{dish.description}</p>

          {/* КБЖУ */}
          <div className="nutrition-grid">
            <div className="nutrition-cell">
              <span className="nutrition-value">{nutrition.calories}</span>
              <span className="nutrition-label">ккал</span>
            </div>
            <div className="nutrition-cell">
              <span className="nutrition-value">{nutrition.protein} г</span>
              <span className="nutrition-label">белки</span>
            </div>
            <div className="nutrition-cell">
              <span className="nutrition-value">{nutrition.fat} г</span>
              <span className="nutrition-label">жиры</span>
            </div>
            <div className="nutrition-cell">
              <span className="nutrition-value">{nutrition.carbs} г</span>
              <span className="nutrition-label">углеводы</span>
            </div>
          </div>
          <p className="nutrition-weight">Вес порции: {nutrition.weight} г</p>

          {/* Состав */}
          <div className="nutrition-section">
            <span className="nutrition-section__title">Состав</span>
            <p className="nutrition-ingredients">{ingredients}</p>
          </div>

          {/* Аллергены */}
          {allergens.length > 0 && (
            <div className="nutrition-section">
              <span className="nutrition-section__title">Аллергены</span>
              <div className="allergens-list">
                {allergens.map((a) => (
                  <span key={a} className="allergen-badge">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Цена + кнопка добавления */}
          <div className="modal__footer">
            <span className="dish-card__price">{formatPrice(dish.price)} ₽</span>

            {cartQty === 0 ? (
              <button className="btn-add" onClick={onAdd}>+ Добавить</button>
            ) : (
              <div className="card-qty-controls">
                <button className="qty-btn" onClick={() => onChangeQty(-1)}>−</button>
                <span className="qty-value">{cartQty}</span>
                <button
                  className="qty-btn"
                  onClick={() => onChangeQty(+1)}
                  disabled={cartQty >= MAX_QTY}
                  title={cartQty >= MAX_QTY ? `Максимум ${MAX_QTY} шт.` : undefined}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Карточка блюда ───────────────────────────
function DishCard({
  dish,
  cartQty,
  onAdd,
  onChangeQty,
  onOpenModal,
}: {
  dish: Dish;
  cartQty: number;
  onAdd: () => void;
  onChangeQty: (delta: number) => void;
  onOpenModal: () => void;
}) {
  return (
    // Вся карточка кликабельна — открывает модальное окно
    <div className="dish-card" onClick={onOpenModal} style={{ cursor: "pointer" }}>
      <div className="dish-card__image-wrap">
        <DishPhoto src={dish.photo} alt={dish.name} className="dish-card__image" />
      </div>

      <div className="dish-card__body">
        <h3 className="dish-card__name">{dish.name}</h3>
        <p className="dish-card__desc">{dish.description}</p>

        <div className="dish-card__footer">
          <span className="dish-card__price">{formatPrice(dish.price)} ₽</span>

          {/* e.stopPropagation() — чтобы клик по кнопкам не открывал модальное окно */}
          {cartQty === 0 ? (
            <button
              className="btn-add"
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
            >
              + Добавить
            </button>
          ) : (
            <div className="card-qty-controls" onClick={(e) => e.stopPropagation()}>
              <button className="qty-btn" onClick={() => onChangeQty(-1)}>−</button>
              <span className="qty-value">{cartQty}</span>
              <button
                className="qty-btn"
                onClick={() => onChangeQty(+1)}
                disabled={cartQty >= MAX_QTY}
                title={cartQty >= MAX_QTY ? `Максимум ${MAX_QTY} шт.` : undefined}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Кнопка категории ─────────────────────────
function CategoryTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`category-tab ${active ? "category-tab--active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ─── Корневой компонент ───────────────────────
export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  // null = окно закрыто, Dish = показываем окно для этого блюда
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Вся логика корзины — в хуке
  const { cart, totalQty, addToCart, changeQty, removeFromCart } = useCart();

  // Фильтрация: сначала по категории, потом по строке поиска
  const filteredDishes = DISHES.filter((dish) => {
    const matchCategory = activeCategory === "all" || dish.category === activeCategory;
    const query = search.trim().toLowerCase();
    const matchSearch =
      query === "" ||
      dish.name.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="header__logo">
            <span className="header__logo-icon">🍽</span>
            <span className="header__logo-text">FastBite</span>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Найти блюдо…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="cart-toggle" onClick={() => setCartOpen(true)} aria-label="Открыть корзину">
            🛒
            {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
          </button>
        </div>
      </header>

      <main className="main">
        <nav className="categories">
          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat.id}
              label={cat.label}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </nav>

        {filteredDishes.length > 0 ? (
          <div className="dishes-grid">
            {filteredDishes.map((dish) => {
              const cartItem = cart.find((c) => c.dish.id === dish.id);
              return (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  cartQty={cartItem?.qty ?? 0}
                  onAdd={() => addToCart(dish)}
                  onChangeQty={(delta) => changeQty(dish.id, delta)}
                  onOpenModal={() => setSelectedDish(dish)}
                />
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>Ничего не найдено 🙁</p>
            <p>Попробуйте другую категорию или измените запрос</p>
          </div>
        )}
      </main>

      {cartOpen && (
        <CartPanel
          cart={cart}
          onClose={() => setCartOpen(false)}
          onChangeQty={changeQty}
          onRemove={removeFromCart}
        />
      )}

      {/* Модальное окно блюда */}
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          cartQty={cart.find((c) => c.dish.id === selectedDish.id)?.qty ?? 0}
          onClose={() => setSelectedDish(null)}
          onAdd={() => addToCart(selectedDish)}
          onChangeQty={(delta) => changeQty(selectedDish.id, delta)}
        />
      )}
    </div>
  );
}
