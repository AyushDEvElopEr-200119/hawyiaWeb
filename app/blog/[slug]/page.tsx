import { notFound } from "next/navigation";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { PostCard } from "@/components/blog/PostCard";
import { ShareLink } from "@/components/blog/ShareLink";
import { LogoMark } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { Breadcrumbs, CtaBand, FaqBlock, JsonLd, SplitTitle } from "@/components/sections";
import { anchor, formatDate, postBySlug, posts, readMinutes, toCard, type Block } from "@/lib/blog";
import { company } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  const meta = pageMeta({ title: post.title, description: post.meta || post.excerpt, path: `/blog/${slug}/` });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: post.date } };
}

// article text comes from our own content file and may hold inline links and emphasis
const html = (__html: string) => ({ dangerouslySetInnerHTML: { __html } });

function BodyBlock({ block }: { block: Block }) {
  if ("h2" in block) return <h2 id={anchor(block.h2)}>{block.h2}</h2>;
  if ("h3" in block) return <h3>{block.h3}</h3>;
  if ("list" in block) return <ul>{block.list.map((li) => <li key={li} {...html(li)} />)}</ul>;
  if ("quote" in block) return <blockquote><p {...html(block.quote)} /></blockquote>;
  if ("note" in block) return <aside className="article-note"><b>{block.note.title}</b><p>{block.note.text}</p></aside>;
  if ("img" in block) {
    return (
      <figure className="article-figure">
        <Photo name={block.img.src} alt={block.img.alt} sizes="(min-width: 861px) 720px, 92vw" />
        {block.img.caption && <figcaption>{block.img.caption}</figcaption>}
      </figure>
    );
  }
  if ("table" in block) {
    const [head, ...rows] = block.table;
    return (
      <div className="article-table">
        <table>
          <thead><tr>{head.map((c, i) => <th key={i} {...html(c)} />)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} {...html(c)} />)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
  if ("faq" in block) return <details className="article-faq"><summary>{block.faq[0]}</summary><p {...html(block.faq[1])} /></details>;
  return <p {...html(block.p)} />;
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
            <span className="byline-avatar"><LogoMark inner="#fff" /></span>
            <span className="byline-who"><b>The {company.short} team</b><small>{readMinutes(post)} min read</small></span>
            <ShareLink title={post.title} />
          </div>
        </header>

        <figure className="article-hero">
          <Photo name={post.photo} alt={post.title} priority sizes="(min-width: 1240px) 1160px, 94vw" />
        </figure>

        <div className="article-layout">
          <ArticleToc items={toc} />
          <div className="article-body">
            {post.body.map((b, i) => <BodyBlock key={i} block={b} />)}
            <footer className="article-end">
              <span className="byline-avatar"><LogoMark inner="#fff" /></span>
              <p><b>The {company.short} team.</b> {company.name} — corporate travel management since 2016.</p>
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

      {post.faq.length > 0 && <FaqBlock faq={post.faq} title="Frequently asked questions" />}
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
            image: company.url + post.photo,
            url: company.url + path,
            mainEntityOfPage: company.url + path,
            author: { "@type": "Organization", name: company.name, url: company.url },
            publisher: { "@id": `${company.url}/#organization` },
          },
          ...(post.faq.length > 0 ? [faqSchema(post.faq)] : []),
        ]}
      />
    </>
  );
}
