import type { ReactNode } from "react";
import type { Copy } from "@/lib/i18n";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function PageShell({ t, page, children }: { t: Copy; page: "home" | "docs"; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        {t.a11y.skip}
      </a>
      <SiteHeader t={t} page={page} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter t={t} page={page} />
    </>
  );
}
