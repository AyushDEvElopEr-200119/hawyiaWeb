import Link from "next/link";
import { Chev } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { CtaBand, FaqBlock, JsonLd, PageHero } from "@/components/sections";
import { generalFaq, guides } from "@/lib/content";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";

const path = "/resources/";
const trail = [{ label: "Resources" }];

export const metadata = pageMeta({
  title: "Resources & FAQ",
  description: "Travel technology guides, insights and answers to common questions about white-label and custom booking software.",
  path,
});

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Resources"
        title="Travel technology,<br />explained plainly"
        intro="Guides and insights for travel businesses choosing, launching and growing their booking platforms."
        ctas={false}
        image="p-resources"
        highlights={[["Guides", "Practical and plain-spoken"], ["Insights", "What is changing in travel tech"], ["FAQ", "Answers before you ask"]]}
      />

      <section className="edit container">
        <div className="edit-grid">
          {guides.map((g, i) => (
            <article className="post reveal" key={g.title}>
              <div className="post-media"><Photo name={`post${i + 1}`} sizes="(min-width: 861px) 320px, 92vw" /></div>
              <small>{g.tag} · Coming soon</small>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </article>
          ))}
        </div>
        <p className="fineprint">Want a guide when it&apos;s published? <Link className="link" href="/contact/">Ask us to send it <Chev /></Link></p>
      </section>

      <FaqBlock faq={generalFaq} title="Frequently asked questions" />
      <CtaBand />
      <JsonLd data={[breadcrumbSchema(trail, path), faqSchema(generalFaq)]} />
    </>
  );
}
