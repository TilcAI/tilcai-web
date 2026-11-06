import Image from "next/image";
import Link from "next/link";
import type { Copy, Locale } from "@/lib/i18n";
import { contact, paths } from "@/lib/site";
import { Icon } from "./Icon";
import { sectionSans } from "./sections/sectionFont";
import styles from "./SiteFooter.module.css";

type Page = "home" | "docs" | "roadmap";
const TECH = ["Stellar", "Soroban", "x402", "CCTP"];
const LOCALES: { lang: Locale; label: string; name: string }[] = [
  { lang: "es", label: "ES", name: "Español" },
  { lang: "en", label: "EN", name: "English" },
];
const pageHref = (page: Page, lang: Locale) => (page === "docs" ? paths.docs(lang) : page === "roadmap" ? paths.roadmap(lang) : paths.home(lang));

function XMark() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

function TelegramMark() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>;
}

function MailMark() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7.5l8.5 6 8.5-6" /></svg>;
}

export function SiteFooter({ t, page }: { t: Copy; page: Page }) {
  const f = t.footer;
  const lang = t.locale;
  const sections = [
    { id: "problem", label: t.nav.problem },
    { id: "solution", label: t.nav.solution },
    { id: "technology", label: t.nav.technology },
    { id: "start", label: t.nav.start },
  ];
  return (
    <footer className={`${styles.footer} ${sectionSans.variable}`}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href={paths.home(lang)} className={styles.logo} aria-label="TilcAI">
              <Image src="/brand/tilcai-logo.webp" width={360} height={138} alt="TilcAI" sizes="120px" />
            </Link>
            <p className={styles.tagline}>{f.tagline}</p>
            <div className={styles.tech}>
              <span>{f.builtWith}</span>
              <ul>{TECH.map((name) => <li key={name}>{name}</li>)}</ul>
            </div>
          </div>

          <nav className={styles.column} aria-labelledby="footer-explore">
            <h2 id="footer-explore">{f.explore}</h2>
            <ul>
              {sections.map((s) => <li key={s.id}><Link href={paths.section(lang, s.id)}>{s.label}</Link></li>)}
            </ul>
          </nav>

          <nav className={styles.column} aria-labelledby="footer-resources">
            <h2 id="footer-resources">{f.resources}</h2>
            <ul>
              <li><Link href={paths.docs(lang)} aria-current={page === "docs" ? "page" : undefined}>{t.nav.docs}</Link></li>
              <li><Link href={paths.roadmap(lang)} aria-current={page === "roadmap" ? "page" : undefined}>{t.nav.roadmap}</Link></li>
            </ul>
          </nav>

          <div className={styles.column}>
            <h2 id="footer-contact">{f.contactLabel}</h2>
            <ul className={styles.channels} aria-labelledby="footer-contact">
              <li><a href={contact.xUrl} target="_blank" rel="noopener noreferrer" aria-label={f.xLabel}><span className={styles.channelIcon}><XMark /></span>{contact.xHandle}</a></li>
              <li><a href={contact.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label={f.telegramLabel}><span className={styles.channelIcon}><TelegramMark /></span>{contact.telegramName}</a></li>
              <li><a href={`mailto:${contact.email}`}><span className={styles.channelIcon}><MailMark /></span>{contact.email}</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bar}>
          <span className={styles.rights}>{f.rights}</span>
          <div className={styles.barActions}>
            <nav className={styles.locales} aria-label={f.language}>
              {LOCALES.map((l) => (
                <Link key={l.lang} href={pageHref(page, l.lang)} hrefLang={l.lang} lang={l.lang} aria-label={l.name} aria-current={l.lang === lang ? "true" : undefined}>{l.label}</Link>
              ))}
            </nav>
            <a className={styles.top} href="#main">{f.backToTop}<Icon name="arrow" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
