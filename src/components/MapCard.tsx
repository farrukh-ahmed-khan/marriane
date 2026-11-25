"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * The "MAP" card on a county page.
 * - With a Mapme link: opens the county's Mapme map in a full-screen popup.
 * - Without one: opens Google Maps for the county in a new tab (old behaviour).
 */
export default function MapCard({
  countyName,
  mapLabel,
  mapmeUrl,
  icon,
}: {
  countyName: string;
  mapLabel: string;
  mapmeUrl?: string;
  icon: string;
}) {
  const [open, setOpen] = useState(false);
  const mapme = isSafeUrl(mapmeUrl) ? mapmeUrl : undefined;

  // Close with Escape and stop the page behind from scrolling while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const body = (
    <>
      <div className="icon">
        <Image src={icon} alt="" fill sizes="50px" />
      </div>
      <h3>MAP</h3>
      <span className="stat-note">{mapLabel}</span>
    </>
  );

  if (!mapme) {
    const google = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLabel)}`;
    return (
      <a className="stat map" href={google} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    );
  }

  return (
    <>
      <button type="button" className="stat map" onClick={() => setOpen(true)} aria-haspopup="dialog">
        {body}
        <span className="stat-note map-hint">View interactive map</span>
      </button>

      {/* rendered at <body> level so it sits above the header and every other layer */}
      {open && createPortal(
        <div className="map-modal" role="dialog" aria-modal="true" aria-label={`${countyName} map`} onClick={() => setOpen(false)}>
          <div className="map-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-head">
              <h2>{countyName} Map</h2>
              <div className="map-modal-actions">
                <a href={mapme} target="_blank" rel="noopener noreferrer">
                  Open in new tab ↗
                </a>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close map" autoFocus>
                  ✕
                </button>
              </div>
            </div>
            <iframe
              src={mapme}
              title={`${countyName} interactive map`}
              allow="fullscreen; geolocation"
              allowFullScreen
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function isSafeUrl(url?: string): url is string {
  if (!url) return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}
