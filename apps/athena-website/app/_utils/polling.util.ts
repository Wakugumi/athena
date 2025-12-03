import { useEffect } from "react";

export function usePolling(fn: () => void, delay: number) {
  useEffect(() => {
    if (!delay) return;
    const id = setInterval(fn, delay);
    return () => clearInterval(id);
  }, [fn, delay]);
}
