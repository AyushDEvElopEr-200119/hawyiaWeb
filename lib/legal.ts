// Starter wording only. Have these reviewed by a qualified lawyer before launch.
import { company } from "./site";

export type LegalDoc = { title: string; sections: [string, string][] };

export const legalDocs: Record<"privacy" | "terms" | "cookies" | "disclaimer", LegalDoc> = {
  privacy: { title: "Privacy Policy", sections: [
    ["Who we are", `${company.name} is a travel technology and software development company. This policy explains how we handle personal information collected through this website.`],
    ["What we collect", "Information you submit in our forms (such as name, business email, company, country, phone and project details), and basic analytics about how the site is used."],
    ["How we use it", "To respond to enquiries, prepare demos and proposals, and improve our website. We do not sell your personal information."],
    ["Sharing", "We share information only with service providers that help us operate (for example email or hosting providers), under appropriate safeguards."],
    ["Your rights", `You can ask to access, correct or delete your information by contacting ${company.email}.`],
  ] },
  terms: { title: "Terms of Use", sections: [
    ["Use of this website", "This website provides information about our products and services. Content may change without notice."],
    ["No offer", "Information on this website is not a binding offer. Commercial terms are set out in a signed agreement."],
    ["Intellectual property", `Content on this website belongs to ${company.name} unless stated otherwise.`],
    ["Liability", "We take care to keep information accurate but cannot guarantee it is complete or current."],
  ] },
  cookies: { title: "Cookie Policy", sections: [
    ["What cookies we use", "Essential cookies needed for the site to work, and, where you consent, analytics cookies that help us understand usage."],
    ["Managing cookies", "You can control cookies through your browser settings and our consent banner where applicable."],
  ] },
  disclaimer: { title: "Disclaimer", sections: [
    ["Software provider", `${company.name} is a software provider. We do not sell travel to the public and are not a party to bookings made on platforms we build.`],
    ["Bookings, payments and support", "Responsibility for bookings, payments, refunds and end-customer support rests with the business operating the platform."],
    ["Suppliers", "Supplier integrations are subject to each supplier's access requirements and agreements with the operating business. Supplier names are trademarks of their owners."],
    ["Feature availability", "Feature availability depends on the chosen product, supplier contracts, integrations and requirements."],
  ] },
};
