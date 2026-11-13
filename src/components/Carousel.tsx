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
  arrowInset,
  lightArrows,
  arrowStyle = "arrow",
}: {
  title: string;
  itemWidth?: string;
  gap?: string;
  children: ReactNode;
  dark?: boolean;
  /** Track runs edge to edge of the screen instead of the content width. */
  bleed?: boolean;
  /** Desktop offset from the right edge of the heading container. */
  arrowInset?: string;
  lightArrows?: boolean;
  arrowStyle?: "arrow" | "chevron";
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.firstElementChild;
    const step = item ? item.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0) : el.clientWidth;
    const end = el.scrollWidth - el.clientWidth;
    if (dir === 1 && el.scrollLeft >= end - 1) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && el.scrollLeft <= 1) {
      el.scrollTo({ left: end, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    }
  };

  return (
    <div
      className={["carousel", dark && "on-dark", bleed && "carousel-bleed", (dark || lightArrows) && "carousel-light-arrows"].filter(Boolean).join(" ")}
      style={{ "--arrow-inset": arrowInset ?? (bleed ? "-160px" : "-15px") } as CSSProperties}
    >
      <div className="carousel-head">
        <h2 className="section-title">{title}</h2>
        <div className="carousel-arrows">
          {([-1, 1] as const).map((direction) => (
            <button key={direction} type="button" aria-label={direction === -1 ? "Previous" : "Next"} onClick={() => scroll(direction)}>
              <svg viewBox={arrowStyle === "chevron" ? "0 0 1000 1000" : "0 0 448 512"} aria-hidden="true" focusable="false" style={direction === -1 ? { transform: "rotate(180deg)" } : undefined}>
                <path d={arrowStyle === "chevron"
                  ? "M696 533C708 521 713 504 713 487 713 471 708 454 696 446L400 146C388 133 375 125 354 125 338 125 325 129 313 142 300 154 292 171 292 187 292 204 296 221 308 233L563 492 304 771C292 783 288 800 288 817 288 833 296 850 308 863 321 871 338 875 354 875 371 875 388 867 400 854L696 533Z"
                  : "M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"} />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div className="carousel-track" ref={track} style={{ "--item": itemWidth, "--gap": gap } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
