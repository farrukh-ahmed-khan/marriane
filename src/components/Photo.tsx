import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * Local image (everything lives in /public/images) rendered with next/image,
 * which serves resized, optimized versions. Shows a neutral placeholder
 * when an item has no photo.
 */
export default function Photo({
  src,
  alt,
  className,
  sizes = "100vw",
  priority,
  style,
}: {
  /** One image path, or a list — the first non-empty one is used. */
  src: string | null | undefined | (string | null | undefined)[];
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
}) {
  const first = (Array.isArray(src) ? src : [src]).find((s): s is string => !!s);

  if (!first) return <span className={`ph ${className || ""}`} role="img" aria-label={alt} style={style} />;

  return (
    <Image
      src={first}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: "cover", ...style }}
    />
  );
}
