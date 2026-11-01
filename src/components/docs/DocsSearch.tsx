"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/types";

export interface DocSearchItem { id: string; title: string; group: string; text: string; }
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function DocsSearch({ items, locale }: { items: DocSearchItem[]; locale: Locale }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const es = locale === "es";
  const close = () => { dialog.current?.close(); trigger.current?.focus(); };
  const show = () => { setQuery(""); dialog.current?.showModal(); };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close(); else { setQuery(""); dialog.current?.showModal(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const matched = items.filter(item => terms.every(term => normalize(item.title + " " + item.text).includes(term))).sort((a,b) =>
    Number(normalize(b.title).includes(normalize(query))) - Number(normalize(a.title).includes(normalize(query))));
  const results = matched.slice(0, 8);
  return <>
    <button ref={trigger} className="docs-search-trigger" onClick={show}><span aria-hidden="true">⌕</span>{es ? "Buscar documentación…" : "Search documentation…"}<kbd>Ctrl K</kbd></button>
    <dialog ref={dialog} className="docs-search-dialog" aria-labelledby="docs-search-title" onClick={e => { if (e.target === dialog.current) close(); }} onClose={() => trigger.current?.focus()}>
      <div className="docs-search-heading"><h2 id="docs-search-title">{es ? "Buscar en TilcAI Docs" : "Search TilcAI Docs"}</h2><button onClick={close} aria-label={es ? "Cerrar búsqueda" : "Close search"}>Esc</button></div>
      <label className="sr-only" htmlFor="docs-query">{es ? "Buscar guías" : "Search guides"}</label>
      <input autoFocus id="docs-query" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={es ? "Prueba «Monad», «passkey» o «SDK»" : "Try “Monad”, “passkey” or “SDK”"}
        onKeyDown={e => { if(e.key === "ArrowDown") { e.preventDefault(); dialog.current?.querySelector<HTMLAnchorElement>(".docs-search-result")?.focus(); } }} />
      <p className="docs-search-count" aria-live="polite">{matched.length} {es ? "guías encontradas" : "guides found"}{matched.length > 8 && (es ? " · mostrando las primeras 8" : " · showing the first 8")}</p>
      <div className="docs-search-results">
        {results.length ? results.map((item, i) => <Link className="docs-search-result" key={item.id} href={"/" + locale + "/docs/" + item.id} onClick={close}
          onKeyDown={e => { const links = dialog.current?.querySelectorAll<HTMLAnchorElement>(".docs-search-result"); if (e.key === "ArrowDown") { e.preventDefault(); links?.[Math.min(i+1, results.length-1)]?.focus(); } if (e.key === "ArrowUp") { e.preventDefault(); if(i === 0) dialog.current?.querySelector<HTMLInputElement>("input")?.focus(); else links?.[i-1]?.focus(); } }}>
          <span>{item.group}</span><strong>{item.title}</strong><p>{item.text.slice(0, 135)}…</p>
        </Link>) : <p className="docs-search-empty">{es ? "No encontramos esa guía. Prueba con otra palabra o explora el índice." : "No guide found. Try a different word or browse the navigation."}</p>}
      </div>
      <div className="docs-search-footer">{es ? "↑ ↓ para navegar · Enter para abrir · Esc para cerrar" : "↑ ↓ to navigate · Enter to open · Esc to close"}</div>
    </dialog>
  </>;
}

