"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pathIn = (to: "en" | "ar", path: string) => {
  const bare = path === "/ar" ? "/" : path.startsWith("/ar/") ? path.slice(3) : path;
  return to === "ar" ? `/ar${bare}` : bare;
};

/**
 * Links to this page in the other language. Switching is a full page load, because the document's
 * language and direction change with it; the flag skips the preloader on that load.
 */
export function LangSwitch({ to, label, className }: { to: "en" | "ar"; label: string; className?: string }) {
  const pathname = usePathname();
  // server-rendered as the other language's home; the exact address is only known in the browser
  const [href, setHref] = useState(to === "ar" ? "/ar/" : "/");
  useEffect(() => { setHref(pathIn(to, location.pathname) + location.search + location.hash); }, [to, pathname]);
  return (
    <a
      href={href}
      hrefLang={to}
      lang={to}
      className={className}
      onClick={(e) => {
        try { sessionStorage.setItem("skip-preloader", "1"); } catch {}
        e.currentTarget.href = pathIn(to, location.pathname) + location.search + location.hash;
      }}
    >
      {label}
    </a>
  );
}
