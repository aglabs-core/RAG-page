import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

declare global {
  interface Window {
    __homeShell?: string;
  }
}

const root = document.getElementById("root")!;
// Topo da home gerado no build (script/build.ts): guardado para o
// carregamento da página mostrar o mesmo conteúdo em vez do spinner.
if (root.dataset.homeShell === "1" && window.location.pathname === "/") {
  window.__homeShell = root.innerHTML;
}

createRoot(root).render(<App />);
