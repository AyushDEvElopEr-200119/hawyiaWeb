import { Block } from "@/components/cws/Blocks";
import { extrasFor } from "@/components/cws/Premium";
import { Breadcrumbs, JsonLd, LeadForm, SplitTitle } from "@/components/sections";
import { cwsPage } from "@/lib/cws";
import { company } from "@/lib/site";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/contact/";
const trail = [{ label: "Contact" }];
const page = cwsPage("contact");
const hero = page.sections[0];
const places = page.sections.filter((s) => s.kind === "cards");
const extras = extrasFor("contact", places);

const mapQuery = encodeURIComponent("A-904/5/6, Kailas Business Park, Hiranandani Link Road, Vikhroli (West), Mumbai 400079");

export const metadata = pageMeta({ title: page.title, description: page.meta, path });

// each desk answers its own line of business
const desks: { title: string; rows: [label: string, text: string, href: string][] }[] = [
  { title: "Phone", rows: [
    ["Landline", company.phone, `tel:${company.phone.replace(/\s/g, "")}`],
    ["Mobile", company.mobile, `tel:${company.mobile.replace(/\s/g, "")}`],
    ["WhatsApp", "Message us on WhatsApp", `https://wa.me/${company.whatsapp}`],
  ] },
  { title: "Email", rows: [
    ["Hotels & serviced apartments", "operations@corporate-stay.com", "mailto:operations@corporate-stay.com"],
    ["Car rentals", "carbooking@corporate-stay.com", "mailto:carbooking@corporate-stay.com"],
    ["Leisure & MICE", "leisure@corporate-stay.com", "mailto:leisure@corporate-stay.com"],
    ["Relocation & logistics", "info@cwslogistix.com", "mailto:info@cwslogistix.com"],
    ["Anything else", company.email, `mailto:${company.email}`],
  ] },
];

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero container">
        <Breadcrumbs trail={trail} />
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="ph-title" data-split><SplitTitle text={hero.title ?? ""} /></h1>
            <p>{hero.text?.[0]}</p>
            <ul className="contact-promise">
              <li><b>Mumbai</b> desk</li>
              <li><b>Every</b> enquiry gets a reply</li>
              <li><b>24/7 coordination</b> for travellers already on the move</li>
            </ul>
            <h2 className="h2 cws-contact-h">Get in touch with us</h2>
            {desks.map((d) => (
              <div className="contact-details" key={d.title}>
                <p className="eyebrow">{d.title}</p>
                {d.rows.map(([label, text, href]) => (
                  <a href={href} className="cd" key={label} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                    <small>{label}</small><b>{text}</b>
                  </a>
                ))}
              </div>
            ))}
            <div className="contact-details">
              <p className="eyebrow">Corporate head office</p>
              <div className="cd"><small>Mumbai – 400079, India</small><b>{company.address}</b></div>
            </div>
          </div>
          <div id="enquire">
            <h2 className="h2 cws-contact-h">Send a message</h2>
            <p className="cws-contact-lede">Tell us roughly what you need and which team it belongs with. We come back with something costed, not a brochure.</p>
            <LeadForm id="contactForm" submit="Send enquiry" />
          </div>
        </div>
      </section>

      {places.map((s, i) => [...(extras.get(i) ?? []), <Block s={s} key={i} />])}

      <section className="container cws-map">
        <div className="split-head">
          <div>
            <p className="eyebrow reveal">Find us</p>
            <h2 className="h2 reveal">Kailas Business Park, Vikhroli (West)</h2>
          </div>
          <a className="link reveal" href={`https://www.google.com/maps?q=${mapQuery}`} target="_blank" rel="noopener">Open in Google Maps <i className="chev" /></a>
        </div>
        <div className="cws-map-frame reveal">
          <iframe title="Map of the Elyra head office" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
