"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/** Lightweight scroll-snap carousel with prev/next arrows. */
export default function Carousel({
  title,
  itemWidth = "300px",
  children,
  dark,
}: {
  title: string;
  itemWidth?: string;
  children: ReactNode;
  dark?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={dark ? "on-dark" : ""}>
      <div className="carousel-head">
        <h2 className="section-title">{title}</h2>
        <div className="carousel-arrows">
          <button aria-label="Previous" onClick={() => scroll(-1)}>←</button>
          <button aria-label="Next" onClick={() => scroll(1)}>→</button>
        </div>
      </div>
      <div className="carousel-track" ref={track} style={{ "--item": itemWidth } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
