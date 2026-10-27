// Privacy Policy and Terms & Conditions, from corporate-stay.com (lib/data/cws-legal.json).
import legalJson from "./data/cws-legal.json";

export type LegalBlock = { p: string } | { list: string[] } | { h3: string };
export type LegalDoc = { title: string; meta: string; intro: string; updated: string | null; sections: { title: string; body: LegalBlock[] }[] };

export const legalDocs = legalJson as unknown as Record<"privacy" | "terms", LegalDoc>;

/** Each document keeps its address from the original site. */
export const legalPaths = { privacy: "/privacy-policy/", terms: "/terms-conditions/" } as const;
