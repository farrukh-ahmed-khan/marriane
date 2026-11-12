"use client";

import Link from "next/link";
import { useState } from "react";
import Photo from "./Photo";
import { SearchIcon } from "./CountyGrid";
import { Trail } from "./ui";

type Item = { slug: string; name: string; count: number; image: string | null };

/** Capers categories grid with search (original: "Capers Type" listing). */
export default function CapersGrid({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const list = items.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="toolbar">
        <div>
          <Trail items={[{ href: "/", label: "Home" }, { label: "Capers" }]} />
          <h2>Capers Type</h2>
        </div>
        <label className="search-field">
          <input type="search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search capers" />
          <SearchIcon />
        </label>
      </div>
      {list.length ? (
        <div className="grid grid-4">
          {list.map((c) => (
            <Link key={c.slug} href={`/county-categories/${c.slug}/`} className="cat-card">
              <div className="img">
                <Photo src={c.image} alt={c.name} sizes="(max-width: 767px) 50vw, 300px" />
              </div>
              <h3>{c.name}</h3>
              <p className="count-note">{c.count} places</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty">No capers match “{query}”.</p>
      )}
    </>
  );
}
