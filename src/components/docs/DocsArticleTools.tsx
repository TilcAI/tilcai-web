"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/types";

/** Backwards compatibility for incoming /docs#section links. */
export function DocsLegacyLinks({ ids, locale }: { ids: string[]; locale: Locale }) {
  const router = useRouter();
  useEffect(() => {
    const follow = () => {
      const id = window.location.hash.slice(1);
      const aliases: Record<string, string> = { payments: "rails", interface: "sdk", compare: "status" };
      const destination = aliases[id] ?? id;
      if(ids.includes(destination)) router.replace("/" + locale + "/docs/" + destination);
    };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, [ids, locale, router]);
  return null;
}

export function DocsArticleTools({ locale, articleId }: { locale: Locale; articleId: string }) {
  const [announcement, setAnnouncement] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLButtonElement>("button[data-doc-copy]");
      const source = button?.closest(".doc-code")?.querySelector("code")?.textContent;
      if (!button || !source) return;
      try {
        await navigator.clipboard.writeText(source);
        button.textContent = locale === "es" ? "Copiado ✓" : "Copied ✓";
        setAnnouncement(locale === "es" ? "Código copiado" : "Code copied");
      } catch {
        button.textContent = locale === "es" ? "Selecciona el código" : "Select the code";
        setAnnouncement(locale === "es" ? "No se pudo copiar. Selecciona el código manualmente." : "Could not copy. Select the code manually.");
      }
      timers.current.push(setTimeout(() => { button.textContent = locale === "es" ? "Copiar" : "Copy"; }, 2500));
    };
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("click", onClick); timers.current.forEach(clearTimeout); timers.current = []; };
  }, [locale, articleId]);
  return <span className="sr-only" role="status">{announcement}</span>;
}

export function DocsOnThisPage({ headings, locale }: { headings: { id: string; title: string }[]; locale: Locale }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if(entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-15% 0px -65% 0px" });
    headings.forEach(h => { const target = document.getElementById(h.id); if(target) observer.observe(target); });
    return () => observer.disconnect();
  }, [headings]);
  return <nav className="docs-local-toc" aria-label={locale === "es" ? "En esta página" : "On this page"}>
    <p>{locale === "es" ? "En esta página" : "On this page"}</p>
    {headings.map(h => <a key={h.id} href={"#" + h.id} aria-current={active === h.id ? "location" : undefined}>{h.title}</a>)}
    <a className="docs-local-edit" href="https://github.com/TilcAI/tilcai-web/tree/main/src/lib/content" rel="noopener">{locale === "es" ? "Ver fuente ↗" : "View source ↗"}</a>
  </nav>;
}

