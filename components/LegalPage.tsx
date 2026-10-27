import { Breadcrumbs, JsonLd } from "./sections";
import { legalDocs, legalPaths } from "@/lib/legal";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

type Key = keyof typeof legalDocs;

export const legalMeta = (key: Key) =>
  pageMeta({ title: legalDocs[key].title, description: legalDocs[key].meta, path: legalPaths[key] });

// legal text comes from our own content file and may hold inline links and emphasis
const html = (__html: string) => ({ dangerouslySetInnerHTML: { __html } });

export function LegalPage({ doc }: { doc: Key }) {
  const d = legalDocs[doc];
  const trail = [{ label: d.title }];
  return (
    <section className="legal container">
      <Breadcrumbs trail={trail} />
      <h1 className="ph-title">{d.title}</h1>
      {d.updated && <p className="muted-sm">{d.updated}</p>}
      <p className="legal-intro">{d.intro}</p>
      {d.sections.map((s) => (
        <div key={s.title}>
          {s.title && <h2>{s.title}</h2>}
          {s.body.map((b, i) =>
            "p" in b ? <p key={i} {...html(b.p)} />
              : "h3" in b ? <h3 key={i}>{b.h3}</h3>
              : <ul key={i}>{b.list.map((li) => <li key={li} {...html(li)} />)}</ul>,
          )}
        </div>
      ))}
      <JsonLd data={breadcrumbSchema(trail, legalPaths[doc])} />
    </section>
  );
}
