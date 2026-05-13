// ─────────────────────────────────────────────
// main.tsx — точка входа приложения
// Монтирует корневой компонент App в div#root
// ─────────────────────────────────────────────

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // подключаем стили

// StrictMode помогает находить ошибки во время разработки
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
