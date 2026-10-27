import { BlogGrid } from "@/components/blog/BlogGrid";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumbs, CtaBand, JsonLd, SplitTitle } from "@/components/sections";
import { posts, toCard } from "@/lib/blog";
import { cwsPage } from "@/lib/cws";
import { company } from "@/lib/site";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/blog/";
const trail = [{ label: "Blog" }];

const page = cwsPage("blog");
const hero = page.sections[0];
const cta = page.sections.find((s) => s.kind === "cta");

export const metadata = pageMeta({ title: page.title, description: page.meta, path });

export default function BlogPage() {
  const [featured, ...rest] = posts.map(toCard);

  return (
    <>
      <section className="journal-hero container">
        <Breadcrumbs trail={trail} />
        <div className="journal-head">
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="ph-title" data-split><SplitTitle text={hero.title ?? ""} /></h1>
          </div>
          <div className="ph-intro">
            {hero.text?.map((t) => <p key={t}>{t}</p>)}
          </div>
        </div>
      </section>

      <section className="container journal-featured" aria-label="Featured article">
        <PostCard post={featured} featured priority />
      </section>

      <BlogGrid posts={rest} />

      <CtaBand eyebrow={cta?.eyebrow} title={cta?.title} text={cta?.text} />
      <JsonLd
        data={[
          breadcrumbSchema(trail, path),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: hero.eyebrow,
            url: company.url + path,
            publisher: { "@id": `${company.url}/#organization` },
            blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${company.url}/blog/${p.slug}/`, datePublished: p.date })),
          },
        ]}
      />
    </>
  );
}
