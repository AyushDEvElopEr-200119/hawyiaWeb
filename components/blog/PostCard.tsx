import Link from "next/link";
import { Photo } from "@/components/Photo";
import type { PostCardData } from "@/lib/blog";

/** A journal card: photo, tag and date, serif title, excerpt. The whole card is the link. */
export function PostCard({ post, featured = false, priority = false }: { post: PostCardData; featured?: boolean; priority?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}/`} className={`jcard press${featured ? " jcard-featured" : ""}`}>
      <div className="jcard-media">
        <Photo name={post.photo} priority={priority} sizes={featured ? "(min-width: 861px) 620px, 92vw" : "(min-width: 861px) 340px, 92vw"} />
      </div>
      <div className="jcard-copy">
        <p className="jcard-meta"><span className="jtag">{post.tag}</span><span>{post.date}</span></p>
        <h3>{post.title}</h3>
        <p className="jcard-excerpt">{post.excerpt}</p>
        <p className="jcard-foot"><span>{post.minutes} min read</span><span className="jcard-go" aria-hidden="true">Read <i className="chev" /></span></p>
      </div>
    </Link>
  );
}
