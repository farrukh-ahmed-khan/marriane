"use client";

import { useState } from "react";
import type { County } from "@/lib/data";
import { CountyCard, Trail } from "./ui";

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function CountyGrid({
  counties,
  title,
}: {
  counties: County[];
  title: string;
}) {
  const [sort, setSort] = useState("default");
  const [query, setQuery] = useState("");

  let list = counties.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "za") list = [...list].sort((a, b) => b.name.localeCompare(a.name));

  return (
    <>
      <div className="toolbar">
        <div>
          <Trail items={[{ href: "/", label: "Home" }, { label: "Counties" }]} />
          <h2>{title}</h2>
        </div>
        <div className="controls">
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort counties">
            <option value="default">Default sorting</option>
            <option value="az">By title from lowest to highest</option>
            <option value="za">By title from highest to lowest</option>
          </select>
          <label className="search-field">
            <input type="search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search counties" />
            <SearchIcon />
          </label>
        </div>
      </div>
      {list.length ? (
        <div className="grid grid-5">
          {list.map((c) => (
            <CountyCard key={c.slug} c={c} />
          ))}
        </div>
      ) : (
        <p className="empty">No counties match “{query}”.</p>
      )}
    </>
  );
}
