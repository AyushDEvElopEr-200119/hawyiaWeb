import { Block, CwsHero } from "@/components/cws/Blocks";
import { JsonLd } from "@/components/sections";
import { cwsPage } from "@/lib/cws";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/team/";
const trail = [{ label: "About Us", href: "/about-us/" }, { label: "Team" }];
const c = cwsPage("team");

export const metadata = pageMeta({ title: c.title, description: c.meta, path });

export default function TeamPage() {
  const [hero, ...rest] = c.sections;
  return (
    <>
      <CwsHero s={{ ...hero, links: [] }} trail={trail} />
      {rest.map((s, i) => <Block s={s} key={i} />)}
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
