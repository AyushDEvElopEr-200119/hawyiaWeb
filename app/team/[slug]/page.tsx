import { notFound } from "next/navigation";
import { Block } from "@/components/cws/Blocks";
import { Photo } from "@/components/Photo";
import { Breadcrumbs, CtaBand, CwsAnchor, JsonLd, SplitTitle } from "@/components/sections";
import { cwsPage, team } from "@/lib/cws";
import { company } from "@/lib/site";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return team.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!team.includes(slug)) return {};
  const c = cwsPage(`team__${slug}`);
  return pageMeta({ title: c.title, description: c.meta, path: `/team/${slug}/` });
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params;
  if (!team.includes(slug)) notFound();
  const c = cwsPage(`team__${slug}`);
  const m = c.member!;
  const path = `/team/${slug}/`;
  const trail = [{ label: "Team", href: "/team/" }, { label: m.name }];
  return (
    <>
      <section className="container cws-member">
        <Breadcrumbs trail={trail} />
        <div className="cws-split">
          <div className="cws-split-media reveal"><Photo name={m.image.src} alt={m.image.alt} priority sizes="(min-width: 861px) 40vw, 92vw" /></div>
          <div className="cws-split-copy">
            <p className="eyebrow">Core team</p>
            <h1 className="ph-title" data-split><SplitTitle text={m.name} /></h1>
            <p className="cws-role">{m.role}</p>
            <p className="cws-lead">{m.lead}</p>
            {m.text.map((t) => <p key={t}>{t}</p>)}
            <div className="cta-row left">
              {m.linkedin && <CwsAnchor link={{ href: m.linkedin, text: "LinkedIn" }} className="btn-pill press" />}
              <CwsAnchor link={{ href: "/contact/", text: "Get in touch" }} />
            </div>
          </div>
        </div>
      </section>
      {c.sections.map((s, i) => <Block s={{ ...s, links: [{ href: "/team/", text: "Back to the team" }] }} key={i} />)}
      <CtaBand />
      <JsonLd data={[
        breadcrumbSchema(trail, path),
        { "@context": "https://schema.org", "@type": "Person", name: m.name, jobTitle: m.role, worksFor: { "@id": `${company.url}/#organization` }, ...(m.linkedin && { sameAs: [m.linkedin] }) },
      ]} />
    </>
  );
}
