"use client";

import { useState } from "react";
import type { PostCardData } from "@/lib/blog";
import { PostCard } from "./PostCard";

const filters = ["All", "Guide", "Insight"] as const;

/**
 * The journal grid with an Apple-style segmented control. The selected segment's pill slides
 * between options; the cards re-enter with a short stagger each time the filter changes.
 */
export function BlogGrid({ posts, labels }: { posts: PostCardData[]; labels: { heading: string; filter: string; All: string; Guide: string; Insight: string } }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const shown = filter === "All" ? posts : posts.filter((p) => p.tag === filter);
  const index = filters.indexOf(filter);

  return (
    <section className="jgrid-sec container" aria-labelledby="latest">
      <div className="jgrid-head">
        <h2 className="h2" id="latest">{labels.heading}</h2>
        <div className="segmented" role="tablist" aria-label={labels.filter} style={{ "--seg": index, "--segs": filters.length } as React.CSSProperties}>
          <span className="seg-pill" aria-hidden="true" />
          {filters.map((f) => (
            <button key={f} type="button" role="tab" aria-selected={f === filter} onClick={() => setFilter(f)}>{labels[f]}</button>
          ))}
        </div>
      </div>
      {/* keyed by filter, so the cards replay their entrance on every change */}
      <div className="jgrid" key={filter} role="tabpanel">
        {shown.map((p, i) => (
          <div className="jgrid-item" key={p.slug} style={{ "--i": i } as React.CSSProperties}>
            <PostCard post={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
