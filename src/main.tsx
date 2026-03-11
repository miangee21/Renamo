//src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App";
import { Toaster } from "sonner";

// Theme persist karo — default dark
const savedTheme = localStorage.getItem("renamo-theme");
if (savedTheme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster richColors position="top-right" theme="system" />
  </StrictMode>,
);
