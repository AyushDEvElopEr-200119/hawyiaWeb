import { setLang, t, type LangParams } from "@/lib/i18n";
import Link from "next/link";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumbs, CtaBand, JsonLd, SplitTitle } from "@/components/sections";
import { posts, toCard } from "@/lib/blog";
import { company } from "@/lib/site";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/blog/";
const trail = [{ label: "Blog" }];

export const generateMetadata = metaFor({
  title: "Blog",
  description: "The Hawyia Journal: practical guides and insights on travel booking software, supplier APIs, payments and running a travel platform.",
  path,
});

export default async function BlogPage({ params }: LangParams) {
  setLang((await params).lang);
  const [featured, ...rest] = posts.map(toCard);

  return (
    <>
      <section className="journal-hero container">
        <Breadcrumbs trail={trail} />
        <div className="journal-head">
          <div>
            <p className="eyebrow">The Hawyia Journal</p>
            <h1 className="ph-title" data-split><SplitTitle text="Notes on building<br />travel technology" /></h1>
          </div>
          <div className="ph-intro">
            <p>Practical guides and plain-spoken insights for travel businesses choosing, launching and growing their booking platforms.</p>
          </div>
        </div>
      </section>

      <section className="container journal-featured" aria-label="Featured article">
        <PostCard post={featured} featured priority />
      </section>

      <BlogGrid posts={rest} labels={{ heading: t("Latest"), filter: t("Filter articles"), All: t("All"), Guide: t("Guides"), Insight: t("Insights") }} />

      <section className="container journal-more">
        <p>Looking for something specific? <Link className="link" href="/resources/#faq">Browse the FAQ <i className="chev" /></Link></p>
      </section>

      <CtaBand />
      <JsonLd
        data={[
          breadcrumbSchema(trail, path),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${company.name} Journal`,
            url: company.url + path,
            publisher: { "@id": `${company.url}/#organization` },
            blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${company.url}/blog/${p.slug}/`, datePublished: p.date })),
          },
        ]}
      />
    </>
  );
}
