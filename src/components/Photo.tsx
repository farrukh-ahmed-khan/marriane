"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Image that works for both local files ("/wp-content/…") and the external
 * photo links from the county documents ("https://…").
 * External links are loaded directly from their source site; if a site
 * blocks or removes the photo, a neutral placeholder is shown instead.
 */
export default function Photo({
  src: srcProp,
  alt,
  className,
  sizes = "100vw",
  priority,
  style,
  hideOnError,
}: {
  /** One image, or a list of candidates tried in order until one loads. */
  src: string | null | undefined | (string | null | undefined)[];
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
  hideOnError?: boolean; // e.g. gallery items: drop instead of placeholder
}) {
  const candidates = (Array.isArray(srcProp) ? srcProp : [srcProp]).filter((s): s is string => !!s);
  const [index, setIndex] = useState(0);
  const src = candidates[index];
  const failed = index > 0 && index >= candidates.length;
  const imgRef = useRef<HTMLImageElement>(null);

  // A server-rendered <img> can fail before React attaches onError,
  // so also check after mounting whether it already failed.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setIndex((i) => i + 1);
  }, [src]);

  if (!src) {
    if (hideOnError && failed) return null;
    return <span className={`ph ${className || ""}`} role="img" aria-label={alt} style={style} />;
  }

  if (src.startsWith("/")) {
    return <Image src={encodeURI(src)} alt={alt} fill sizes={sizes} priority={priority} className={className} style={style} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      ref={imgRef}
      src={src}
      alt={alt}
      className={`ext ${className || ""}`}
      style={style}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
