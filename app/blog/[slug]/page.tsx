import { notFound } from "next/navigation";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { PostCard } from "@/components/blog/PostCard";
import { ShareLink } from "@/components/blog/ShareLink";
import { LogoMark } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { Breadcrumbs, CtaBand, JsonLd, SplitTitle } from "@/components/sections";
import { anchor, formatDate, postBySlug, posts, readMinutes, toCard, type Block } from "@/lib/blog";
import { company } from "@/lib/site";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  const meta = pageMeta({ title: post.title, description: post.excerpt, path: `/blog/${slug}/` });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: post.date } };
}

function BodyBlock({ block }: { block: Block }) {
  if ("h2" in block) return <h2 id={anchor(block.h2)}>{block.h2}</h2>;
  if ("list" in block) return <ul>{block.list.map((li) => <li key={li}>{li}</li>)}</ul>;
  if ("quote" in block) return <blockquote><p>{block.quote}</p></blockquote>;
  if ("note" in block) return <aside className="article-note"><b>{block.note.title}</b><p>{block.note.text}</p></aside>;
  return <p>{block.p}</p>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();
  const path = `/blog/${slug}/`;
  const trail = [{ label: "Blog", href: "/blog/" }, { label: post.title }];
  const toc = post.body.flatMap((b) => ("h2" in b ? [{ id: anchor(b.h2), text: b.h2 }] : []));
  // the next three articles, wrapping round the list
  const at = posts.indexOf(post);
  const related = [1, 2, 3].map((n) => posts[(at + n) % posts.length]).map(toCard);

  return (
    <>
      <div className="read-progress" aria-hidden="true" />
      <article className="article">
        <header className="article-head">
          <Breadcrumbs trail={trail} />
          <p className="article-kicker"><span className="jtag">{post.tag}</span><time dateTime={post.date}>{formatDate(post.date)}</time></p>
          <h1 className="ph-title article-title" data-split><SplitTitle text={post.title} /></h1>
          <p className="article-dek">{post.excerpt}</p>
          <div className="article-byline">
            <span className="byline-avatar"><LogoMark /></span>
            <span className="byline-who"><b>{company.name} Team</b><small>{readMinutes(post)} min read</small></span>
            <ShareLink title={post.title} />
          </div>
        </header>

        <figure className="article-hero">
          <Photo name={post.photo} priority sizes="(min-width: 1240px) 1160px, 94vw" />
        </figure>

        <div className="article-layout">
          <ArticleToc items={toc} />
          <div className="article-body">
            {post.body.map((b, i) => <BodyBlock key={i} block={b} />)}
            <footer className="article-end">
              <span className="byline-avatar"><LogoMark /></span>
              <p><b>Written by the {company.name} Team.</b> We build white-label and custom booking platforms for travel businesses, and write here about what we learn along the way.</p>
            </footer>
          </div>
        </div>
      </article>

      <section className="container journal-related" aria-labelledby="keep-reading">
        <h2 className="h2" id="keep-reading">Keep reading</h2>
        <div className="jgrid">
          {related.map((p) => <div className="jgrid-item reveal" key={p.slug}><PostCard post={p} /></div>)}
        </div>
      </section>

      <CtaBand />
      <JsonLd
        data={[
          breadcrumbSchema(trail, path),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            image: `${company.url}/assets/media/${post.photo}-1600.webp`,
            url: company.url + path,
            mainEntityOfPage: company.url + path,
            author: { "@type": "Organization", name: company.name, url: company.url },
            publisher: { "@id": `${company.url}/#organization` },
          },
        ]}
      />
    </>
  );
}
