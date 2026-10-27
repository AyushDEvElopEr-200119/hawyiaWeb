import Link from "next/link";
import { Chev } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { CtaBand, JsonLd, PageHero } from "@/components/sections";
import { featured, hasSamples, stories, storyCats, type Story } from "@/lib/testimonials";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/testimonials/";
const trail = [{ label: "Client Stories" }];

export const metadata = {
  ...pageMeta({
    title: "Client Stories",
    description: "How travel agencies, tour operators, wholesalers, corporate travel teams and bus operators run their business on Elyra.",
    path,
  }),
  // sample stories are placeholders: keep the page out of search results until real ones replace them
  ...(hasSamples ? { robots: { index: false, follow: true } } : {}),
};

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function Person({ s, light = false }: { s: Story; light?: boolean }) {
  return (
    <div className={`ts-person${light ? " light" : ""}`}>
      <span className="ts-avatar" aria-hidden="true">{initials(s.name)}</span>
      <div>
        <b>{s.name}</b>
        <span>{s.role}, {s.company} · {s.place}</span>
      </div>
    </div>
  );
}

const SampleTag = ({ s }: { s: Story }) => (s.sample ? <span className="ts-sample">Sample</span> : null);

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Client stories"
        title="Travel businesses,<br />in their own words"
        intro="Agencies, tour operators, wholesalers, corporate travel teams and fleet owners on what changed once their platform went live."
        image="p-testimonials"
        highlights={[["Agencies & OTAs", "Branded sites and agent portals"], ["Operators & DMCs", "Packages, contracts, distribution"], ["Corporate & ground", "Policies, fleets and seats"]]}
      />

      {/* featured story: one photo, one glass panel, one quote */}
      <section className="ts-feature container reveal" aria-label="Featured story">
        <Photo name={featured.photo} className="ts-feature-img" sizes="(min-width: 1200px) 1160px, 94vw" />
        <figure className="ts-feature-glass">
          <SampleTag s={featured} />
          <span className="ts-mark" aria-hidden="true">“</span>
          <blockquote>{featured.quote}</blockquote>
          <figcaption><Person s={featured} light /></figcaption>
          <ul className="ts-built">{featured.built.map((b) => <li key={b}>{b}</li>)}</ul>
        </figure>
      </section>

      <section className="ts-wall container">
        <div className="split-head">
          <h2 className="h2 reveal">Stories from<br />every kind of business</h2>
          <p className="reveal">Pick a business type to see the platforms and integrations behind each story.</p>
        </div>
        <div className="filters reveal" role="group" aria-label="Filter stories by business type">
          {storyCats.map((c, i) => <button className="filter press" aria-pressed={i === 0} data-filter={c} key={c}>{c}</button>)}
        </div>
        <div className="ts-grid" data-directory>
          {stories.map((s, i) => (
            <figure className={`ts-card${i % 4 === 1 ? " is-dark" : ""}`} data-cat={s.cat} key={s.id}>
              <div className="ts-card-media">
                <Photo name={s.photo} className="ts-card-img" sizes="(min-width: 861px) 380px, 92vw" />
                <span className="ts-cat">{s.cat}</span>
                <SampleTag s={s} />
              </div>
              <div className="ts-card-body">
                <blockquote>“{s.quote}”</blockquote>
                <figcaption><Person s={s} light={i % 4 === 1} /></figcaption>
                <ul className="ts-built small">{s.built.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            </figure>
          ))}
        </div>
      </section>

      <section className="ts-next container">
        <div className="ts-next-inner reveal">
          <p className="eyebrow">Your story next</p>
          <h2 className="h2">Tell us where you want<br />your business to be</h2>
          <p>We&apos;ll show you how agencies and operators like yours launched, and what it would take for you.</p>
          <div className="cta-row left">
            <Link href="/request-demo/" className="btn-pill press">Request a Demo <Chev /></Link>
            <Link href="/solutions/" className="link">Explore solutions <Chev /></Link>
          </div>
        </div>
      </section>

      <CtaBand title="Start your own story" preset="White-label platform" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
