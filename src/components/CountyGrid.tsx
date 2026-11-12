"use client";

import { useState } from "react";
import type { County } from "@/lib/data";
import { CountyCard } from "./ui";

export default function CountyGrid({
  counties,
  title,
  counts,
}: {
  counties: County[];
  title: string;
  counts?: Record<string, number>;
}) {
  const [sort, setSort] = useState("default");
  const [query, setQuery] = useState("");

  let list = counties.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "za") list = [...list].sort((a, b) => b.name.localeCompare(a.name));

  return (
    <>
      <div className="toolbar">
        <h2>{title}</h2>
        <div className="controls">
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort counties">
            <option value="default">Default sorting</option>
            <option value="az">By title from lowest to highest</option>
            <option value="za">By title from highest to lowest</option>
          </select>
          <input type="search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search counties" />
        </div>
      </div>
      {list.length ? (
        <div className="grid grid-5">
          {list.map((c) => (
            <CountyCard key={c.slug} c={c} count={counts?.[c.slug]} />
          ))}
        </div>
      ) : (
        <p className="empty">No counties match “{query}”.</p>
      )}
    </>
  );
}
