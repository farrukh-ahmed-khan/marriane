"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

/**
 * Image that works for both local files ("/wp-content/…") and the external
 * photo links from the county documents ("https://…").
 * External links are loaded directly from their source site; if a site
 * blocks or removes the photo, a neutral placeholder is shown instead.
 */
export default function Photo({
  src,
  alt,
  className,
  sizes = "100vw",
  priority,
  style,
  hideOnError,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
  hideOnError?: boolean; // e.g. gallery items: drop instead of placeholder
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    if (hideOnError && failed) return null;
    return <span className={`ph ${className || ""}`} role="img" aria-label={alt} style={style} />;
  }

  if (src.startsWith("/")) {
    return <Image src={encodeURI(src)} alt={alt} fill sizes={sizes} priority={priority} className={className} style={style} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`ext ${className || ""}`}
      style={style}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
