"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ExternalLink, FileText, LogOut, Mail, Menu, MessagesSquare, ScrollText, Settings, X } from "lucide-react";
import { LogoMark } from "@/components/Brand";
import { AdminProviders } from "./ui";

const NAV = [
  { href: "/admin/settings/communication/email/", label: "Email Configuration", icon: Mail },
  { href: "/admin/settings/communication/email/templates/", label: "Email Templates", icon: FileText },
  { href: "/admin/settings/communication/email/logs/", label: "Email Logs", icon: ScrollText },
];

export function AdminShell({ user, children }: { user: { email: string; name: string }; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const current = NAV.find((n) => pathname === n.href || pathname === n.href.slice(0, -1)) ?? NAV[0];
  const initials = user.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <AdminProviders>
      <div className={`adm-app${open ? " nav-open" : ""}`}>
        <aside className="adm-side" aria-label="Admin navigation">
          <div className="adm-brand">
            <span className="adm-brand-mark"><LogoMark /></span>
            <span className="adm-brand-words"><b>Hawyia</b><em>Premium</em></span>
            <span className="adm-brand-tag">Admin</span>
            <button type="button" className="adm-icon-btn adm-side-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button>
          </div>
          <nav className="adm-nav">
            <p className="adm-nav-group"><Settings size={14} /> Settings</p>
            <p className="adm-nav-sub"><MessagesSquare size={14} /> Communication Settings</p>
            <ul>
              {NAV.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className={`adm-nav-link${current.href === href ? " is-active" : ""}`} aria-current={current.href === href ? "page" : undefined}>
                    <Icon size={18} /><span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="adm-user">
            <span className="adm-avatar" aria-hidden="true">{initials}</span>
            <span className="adm-user-text"><b>{user.name}</b><small>{user.email}</small></span>
            <form action="/api/admin/auth/logout/" method="post">
              <button type="submit" className="adm-icon-btn" aria-label="Sign out" title="Sign out"><LogOut size={18} /></button>
            </form>
          </div>
        </aside>
        <button type="button" className="adm-scrim" aria-label="Close menu" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} />

        <div className="adm-main">
          <header className="adm-top">
            <button type="button" className="adm-icon-btn adm-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            <nav className="adm-crumbs" aria-label="Breadcrumb">
              <span>Settings</span><span aria-hidden="true">/</span><span>Communication Settings</span><span aria-hidden="true">/</span><b>{current.label}</b>
            </nav>
            <a className="adm-btn is-ghost is-sm adm-site-link" href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View website</a>
          </header>
          <main className="adm-content">{children}</main>
        </div>
      </div>
    </AdminProviders>
  );
}
