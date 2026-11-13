"use client";

import { useId, useMemo, useState } from "react";
import type { AttractionCard } from "@/lib/data";
import { AttractionTile } from "./ui";

const PAGE = 24;

/**
 * Sidebar search + checkbox filter, and the grid of attraction tiles they
 * control. Used on county pages (filter by category), category pages
 * (filter by county) and the all-attractions page.
 */
export default function AttractionBrowser({
  attractions,
  filters,
  filterBy,
  filterTitle = "Filter by attraction",
  heading = "Famous Attractions",
  emptyText = "Attractions for this county are coming soon.",
  columns = 4,
  sidebarTop,
  children,
}: {
  columns?: 4 | 5;
  sidebarTop?: React.ReactNode; // e.g. breadcrumb, shown above the search box
  attractions: AttractionCard[];
  filters: { slug: string; name: string }[];
  filterBy: "categories" | "counties";
  filterTitle?: string;
  heading?: string;
  emptyText?: string;
  children?: React.ReactNode; // page content rendered above the grid
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [limit, setLimit] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterPanelId = useId();

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    attractions.forEach((a) => a[filterBy].forEach((c) => (m[c] = (m[c] || 0) + 1)));
    return m;
  }, [attractions, filterBy]);

  const visible = attractions.filter(
    (a) =>
      (!selected.length || a[filterBy].some((c) => selected.includes(c))) &&
      (!query || a.title.toLowerCase().includes(query.toLowerCase()))
  );

  const toggle = (slug: string) => {
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
    setLimit(PAGE);
  };

  return (
    <div className="county-layout container">
      <aside className="sidebar">
        {sidebarTop}
        <div className="box">
          <input
            className="search-input"
            type="search"
            placeholder="Search attractions"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
            aria-label="Search attractions"
          />
        </div>
        {filters.length > 1 && (
          <>
            <button
              type="button"
              className="filter-toggle"
              aria-expanded={filtersOpen}
              aria-controls={filterPanelId}
              onClick={() => setFiltersOpen((value) => !value)}
            >
              {filtersOpen ? "Hide filters" : filterTitle}
              {selected.length > 0 && ` (${selected.length} selected)`}
            </button>
            <div id={filterPanelId} className={`box filter-panel${filtersOpen ? " is-open" : ""}`}>
              <h2>{filterTitle}</h2>
              <ul className="filter-list">
                {filters.map((c) => (
                  <li key={c.slug}>
                    <label>
                      <input type="checkbox" checked={selected.includes(c.slug)} onChange={() => toggle(c.slug)} />
                      {c.name}
                      <span className="n">{counts[c.slug] || 0}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {selected.length > 0 && (
                <button className="clear-btn" onClick={() => setSelected([])}>
                  Clear filters
                </button>
              )}
            </div>
          </>
        )}
      </aside>

      <div>
        {children}
        <div className="grid-head" id="attractions">
          <h2 className="block-title">{heading}</h2>
          {attractions.length > 0 && (
            <span className="result-count">
              {visible.length} {visible.length === 1 ? "place" : "places"}
            </span>
          )}
        </div>
        {visible.length ? (
          <>
            <div className={`grid grid-${columns}`} style={{ gap: 10 }}>
              {visible.slice(0, limit).map((a) => (
                <AttractionTile key={a.slug} a={a} />
              ))}
            </div>
            {visible.length > limit && (
              <div className="center" style={{ marginTop: 24 }}>
                <button className="btn btn-green" onClick={() => setLimit((n) => n + PAGE * 2)}>
                  Show more ({visible.length - limit} more)
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="empty">{attractions.length ? "No attractions match your filters." : emptyText}</p>
        )}
      </div>
    </div>
  );
}
