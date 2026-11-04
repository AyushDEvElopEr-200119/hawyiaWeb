import { setLang, type LangParams } from "@/lib/i18n";
import Link from "next/link";
import { Chev } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { CtaBand, FaqBlock, JsonLd, PageHero } from "@/components/sections";
import { generalFaq } from "@/lib/content";
import { posts } from "@/lib/blog";
import { breadcrumbSchema, faqSchema, metaFor } from "@/lib/seo";

const path = "/resources/";
const trail = [{ label: "Resources" }];

export const generateMetadata = metaFor({
  title: "Resources & FAQ",
  description: "Travel technology guides, insights and answers to common questions about white-label and custom booking software.",
  path,
});

export default async function ResourcesPage({ params }: LangParams) {
  setLang((await params).lang);
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
          {posts.map((g) => (
            <article className="post press reveal" key={g.slug}>
              <div className="post-media"><Photo name={g.photo} sizes="(min-width: 861px) 320px, 92vw" /></div>
              <small>{g.tag}</small>
              <h3>{g.title}</h3>
              <p>{g.excerpt}</p>
              <Link href={`/blog/${g.slug}/`} className="link">Read article <Chev /></Link>
            </article>
          ))}
        </div>
        <p className="fineprint">Every article lives in <Link className="link" href="/blog/">the Hawyia Journal <Chev /></Link></p>
      </section>

      <FaqBlock faq={generalFaq} title="Frequently asked questions" />
      <CtaBand />
      <JsonLd data={[breadcrumbSchema(trail, path), faqSchema(generalFaq)]} />
    </>
  );
}
