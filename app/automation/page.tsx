import Link from "next/link";
import { Chev } from "@/components/Brand";
import { PhotoSplit, StepLine } from "@/components/cinematic";
import { Photo } from "@/components/Photo";
import { Breadcrumbs, FaqBlock, JsonLd, SplitTitle } from "@/components/sections";
import {
  automationAiUses, automationCompare, automationConnects, automationFaq, automationFlows, automationHighlights,
  automationIndustries, automationPrinciples, automationSigns, automationSteps,
} from "@/lib/automation";
import { automationTabs } from "@/lib/home";
import { breadcrumbSchema, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

const path = "/automation/";
const trail = [{ label: "Automation" }];
const description = "Hawyia Premium automates approvals, invoices, follow-ups, reporting and other repetitive work, so your team has more time for the work that needs a person.";

export const metadata = pageMeta({ title: "Business Automation", description, path });

const pad = (i: number) => String(i + 1).padStart(2, "0");

export default function AutomationPage() {
  const areas = Object.keys(automationTabs);
  const flows = Object.keys(automationFlows);
  return (
    <>
      <section className="page-hero ap-hero">
        <div className="container ph-head">
          <Breadcrumbs trail={trail} />
          <div className="ap-head">
            <p className="eyebrow">Automation</p>
            <h1 className="ph-title ap-title" data-split><SplitTitle text="Stop repeating.<br />Start automating." /></h1>
            <p className="ap-lead">If a task follows the same steps every time, it&apos;s worth asking whether a person still needs to do it.</p>
            <div className="cta-row">
              <Link href="/contact/" className="btn-pill press">Let&apos;s talk <Chev /></Link>
              <a href="#how" className="link">See how it works <Chev /></a>
            </div>
          </div>
        </div>
        <div className="xp ph-stage" data-expand>
          <div className="ph-media xp-frame" data-ph-media>
            <Photo name="p-hire-developers" className="ph-bg" priority />
            <ul className="ph-highlights" data-ph-hl>
              {automationHighlights.map(([t, d], i) => (
                <li key={t}><span className="mono">{pad(i)}</span><b>{t}</b><p>{d}</p></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="ap-section container" id="signs">
        <div className="ap-sec-head">
          <h2 className="ap-h2 reveal">Sound familiar?</h2>
          <p className="ap-text reveal">These are usually the first signs that a process is ready to be automated.</p>
        </div>
        <div className="ap-cards">
          {automationSigns.map(([t, d]) => (
            <article className="ap-card reveal" key={t}><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      <section className="ap-section ap-flow-sec container" id="how">
        <div className="ap-sec-head">
          <h2 className="ap-h2 reveal">One trigger.<br />Everything follows.</h2>
          <p className="ap-text reveal">Something happens, and the steps that usually follow it run on their own. Choose an example.</p>
        </div>
        <div className="tabs ap-tabs reveal" role="tablist" aria-label="Automation examples" data-tabs>
          <span className="tab-ind" aria-hidden="true" />
          {flows.map((k, i) => (
            <button key={k} role="tab" id={`ex-t${i}`} aria-controls={`ex-p${i}`} aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1}>{k}</button>
          ))}
        </div>
        {flows.map((k, i) => (
          <ol key={k} className="ap-flow" role="tabpanel" id={`ex-p${i}`} aria-labelledby={`ex-t${i}`} hidden={i !== 0}>
            {automationFlows[k].map((step, j) => (
              <li key={step}><span className="mono">{pad(j)}</span><p>{step}</p></li>
            ))}
          </ol>
        ))}
      </section>

      <section className="ap-section container" id="difference">
        <div className="ap-sec-head">
          <h2 className="ap-h2 reveal">Same work. Less effort.</h2>
        </div>
        <table className="ap-compare reveal">
          <thead>
            <tr><th scope="col">Task</th><th scope="col">By hand</th><th scope="col">Automated</th></tr>
          </thead>
          <tbody>
            {automationCompare.map(([task, manual, automated]) => (
              <tr key={task}>
                <th scope="row">{task}</th>
                <td data-label="By hand">{manual}</td>
                <td data-label="Automated">{automated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="ap-section container" id="areas">
        <div className="ap-sec-head">
          <h2 className="ap-h2 reveal">Wherever the work repeats.</h2>
          <p className="ap-text reveal">Choose an area to see what can run without someone having to remember it.</p>
        </div>
        <div className="tabs ap-tabs reveal" role="tablist" aria-label="Areas of automation" data-tabs>
          <span className="tab-ind" aria-hidden="true" />
          {areas.map((k, i) => (
            <button key={k} role="tab" id={`ar-t${i}`} aria-controls={`ar-p${i}`} aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1}>{k}</button>
          ))}
        </div>
        <div className="panels">
          {areas.map((k, i) => (
            <div key={k} className={`panel${i === 0 ? " is-on" : ""}`} role="tabpanel" id={`ar-p${i}`} aria-labelledby={`ar-t${i}`} hidden={i !== 0}>
              {automationTabs[k].map(([t, d]) => <div className="feat" key={t}><h3>{t}</h3><p>{d}</p></div>)}
            </div>
          ))}
        </div>
      </section>

      <PhotoSplit
        image="d-custom-software-integrations"
        eyebrow="Connected"
        title="Works with the tools you already use"
        items={automationConnects}
      />

      <section className="ap-section container" id="ai">
        <article className="ap-feature reveal">
          <div>
            <h2 className="ap-h2">When a step needs more than a rule, add AI.</h2>
          </div>
          <div className="ap-feature-copy">
            <p>Fixed rules handle predictable work. AI can take on steps that involve reading, searching or writing, with your team still making the decisions that matter.</p>
            <ul className="eng-chips">{automationAiUses.map((u) => <li key={u}>{u}</li>)}</ul>
            <Link href="/contact/" className="link light">Explore AI possibilities <Chev /></Link>
          </div>
        </article>
      </section>

      <section className="ap-section container" id="industries">
        <div className="ap-sec-head">
          <h2 className="ap-h2 reveal">Every industry has its own repeats.</h2>
        </div>
        <div className="ap-cards">
          {automationIndustries.map(([t, d]) => (
            <article className="ap-card reveal" key={t}><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      <section className="ap-section container" id="approach">
        <div className="ap-sec-head">
          <h2 className="ap-h2 reveal">Simple, from the first step.</h2>
        </div>
        <div className="ap-cards">
          {automationPrinciples.map(([t, d]) => (
            <article className="ap-card reveal" key={t}><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      <section className="ap-section container" id="process">
        <div className="ap-sec-head">
          <h2 className="ap-h2 reveal">How we get you there.</h2>
        </div>
        <StepLine steps={automationSteps} />
      </section>

      <FaqBlock faq={automationFaq} />
      <JsonLd data={[
        breadcrumbSchema(trail, path),
        faqSchema(automationFaq),
        serviceSchema({ name: "Business Automation", description, path, type: "Business process automation" }),
      ]} />
    </>
  );
}
