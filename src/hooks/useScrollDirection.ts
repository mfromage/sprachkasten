"use client";

import { useState, useEffect, useRef } from "react";

export function useScrollDirection() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const threshold = 10;

    function updateScrollDir() {
      const scrollY = window.scrollY;
      const diff = scrollY - lastScrollY.current;

      // Only update if scrolled past threshold
      if (Math.abs(diff) > threshold) {
        setHidden(diff > 0 && scrollY > 100); // Hide when scrolling down and past 100px
        lastScrollY.current = scrollY;
      }
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDir);
        ticking.current = true;
      }
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}
