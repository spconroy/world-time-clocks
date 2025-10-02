"use client";

import { useState, useEffect, RefObject } from "react";

export type ClockSize = "tiny" | "small" | "medium" | "large";

export function useAutoResize(containerRef: RefObject<HTMLDivElement | null>, autoResize: boolean = true) {
  const [columns, setColumns] = useState<number>(6);
  const [clockSize, setClockSize] = useState<ClockSize>("medium");

  useEffect(() => {
    if (!autoResize || !containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      // Calculate optimal columns based on container width
      let newColumns: number;
      if (width < 400) newColumns = 1;
      else if (width < 640) newColumns = 2;
      else if (width < 900) newColumns = 3;
      else if (width < 1200) newColumns = 4;
      else if (width < 1600) newColumns = 6;
      else newColumns = 8;

      setColumns(newColumns);

      // Adjust clock size based on available space per clock
      const availableWidth = width / newColumns - 32; // Subtract gap
      if (availableWidth < 100) setClockSize("tiny");
      else if (availableWidth < 140) setClockSize("small");
      else if (availableWidth < 180) setClockSize("medium");
      else setClockSize("large");
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, autoResize]);

  return { columns, clockSize };
}
