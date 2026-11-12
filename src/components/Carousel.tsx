"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/** Lightweight scroll-snap carousel with prev/next arrows. */
export default function Carousel({
  title,
  itemWidth = "300px",
  gap = "20px",
  children,
  dark,
  bleed,
}: {
  title: string;
  itemWidth?: string;
  gap?: string;
  children: ReactNode;
  dark?: boolean;
  /** Track runs edge to edge of the screen instead of the content width. */
  bleed?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={[dark && "on-dark", bleed && "carousel-bleed"].filter(Boolean).join(" ")}>
      <div className="carousel-head">
        <h2 className="section-title">{title}</h2>
        <div className="carousel-arrows">
          <button aria-label="Previous" onClick={() => scroll(-1)}>←</button>
          <button aria-label="Next" onClick={() => scroll(1)}>→</button>
        </div>
      </div>
      <div className="carousel-track" ref={track} style={{ "--item": itemWidth, "--gap": gap } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
