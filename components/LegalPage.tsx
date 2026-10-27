import { Breadcrumbs, JsonLd } from "./sections";
import { legalDocs } from "@/lib/legal";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import { company } from "@/lib/site";

type Key = keyof typeof legalDocs;

export const legalMeta = (key: Key) =>
  pageMeta({ title: legalDocs[key].title, description: `${legalDocs[key].title} for ${company.name}.`, path: `/${key}/` });

export function LegalPage({ doc }: { doc: Key }) {
  const d = legalDocs[doc];
  const trail = [{ label: d.title }];
  return (
    <section className="legal container">
      <Breadcrumbs trail={trail} />
      <h1 className="ph-title">{d.title}</h1>
      <p className="muted-sm">Last updated: {new Date().getFullYear()}</p>
      {d.sections.map(([h, t]) => (
        <div key={h}>
          <h2>{h}</h2>
          <p>{t}</p>
        </div>
      ))}
      <JsonLd data={breadcrumbSchema(trail, `/${doc}/`)} />
    </section>
  );
}
