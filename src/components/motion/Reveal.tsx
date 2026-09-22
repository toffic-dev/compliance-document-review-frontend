"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset for sibling blocks, in milliseconds. */
  delay?: number;
}

/**
 * Fades and lifts its children into view the first time they scroll on screen.
 *
 * The hidden "before" state lives in the stylesheet and is scoped to
 * `html[data-reveal="ready"]`, which the root layout sets only when
 * IntersectionObserver is available. Visitors without JavaScript (or without
 * that API) therefore get plain, visible content, and reduced-motion visitors
 * get the same through the reduced-motion block in globals.css.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    // Flipping state from the observer callback keeps the effect itself free
    // of synchronous updates.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setIsVisible(true);
          observer.disconnect();
          return;
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", isVisible && "is-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
