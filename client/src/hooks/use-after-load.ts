import { useEffect, useState } from "react";

// Libera efeitos pesados (WebGL, three.js) só depois que a página carregou e o
// navegador ficou ocioso, para não disputarem a thread com o primeiro conteúdo.
export function useAfterLoad(timeout = 3000): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timerId: number | undefined;

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout });
      } else {
        timerId = setTimeout(() => setReady(true), 1200) as unknown as number;
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [timeout]);

  return ready;
}
