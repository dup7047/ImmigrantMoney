"use client";

import {useEffect, useRef} from "react";

/**
 * Returns a ref to attach to a result-section element. When `result` flips
 * from null/undefined/empty to truthy, the section scrolls into view.
 *
 * Respects `prefers-reduced-motion` — reduced-motion users get an instant
 * jump instead of smooth scroll. Skips when result is empty (initial render).
 */
export function useResultScroll<T>(result: T | null | undefined): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!result) return;
    if (Array.isArray(result) && result.length === 0) return;
    if (!ref.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ref.current.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start"
    });
  }, [result]);

  return ref;
}
