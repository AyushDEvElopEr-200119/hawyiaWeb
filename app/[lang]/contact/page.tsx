import { setLang, type LangParams } from "@/lib/i18n";
import Link from "next/link";
import { Breadcrumbs, JsonLd, LeadForm, SplitTitle } from "@/components/sections";
import { company } from "@/lib/site";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/contact/";
const trail = [{ label: "Contact" }];

export const generateMetadata = metaFor({
  title: "Contact",
  description: "Contact Hawyia: request a demo, get a quote or book a consultation about travel booking software.",
  path,
});

export default async function ContactPage({ params }: LangParams) {
  setLang((await params).lang);
  const hasDetails = company.email || company.phone || company.whatsapp || company.address;
  return (
    <section className="contact-hero container">
      <Breadcrumbs trail={trail} />
      <div className="contact-grid">
        <div className="contact-copy">
          <h1 className="ph-title" data-split><SplitTitle text="Let's build your<br />travel platform" /></h1>
          <p>Request a demo, ask for a quote, or book a consultation. A travel technology specialist will reply within one business day.</p>
          <div className="contact-options">
            <Link href="/request-demo/" className="opt press"><b>Request a demo</b><span>See the platform on your use case</span></Link>
            <a href="#enquire" className="opt press"><b>Get a quote</b><span>Itemised by modules and integrations</span></a>
            <a href="#enquire" className="opt press"><b>Book a consultation</b><span>Talk through white-label vs custom</span></a>
          </div>
          {hasDetails && (
            <div className="contact-details">
              {company.email && <a href={`mailto:${company.email}`} className="cd"><small>Email</small><b>{company.email}</b></a>}
              {company.phone && <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="cd"><small>Phone</small><b>{company.phone}</b></a>}
              {company.whatsapp && <a href={`https://wa.me/${company.whatsapp}`} className="cd" rel="noopener"><small>WhatsApp</small><b>Chat with us</b></a>}
              {company.address && <div className="cd"><small>Office</small><b>{company.address}</b></div>}
            </div>
          )}
        </div>
        <div id="enquire"><LeadForm id="contactForm" submit="Send message" /></div>
      </div>
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </section>
  );
}
