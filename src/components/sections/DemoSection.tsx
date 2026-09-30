import type { Copy } from "@/lib/i18n";
import { PolicyDemo } from "../PolicyDemo";
import { SectionHead } from "./shared";

/** Visual policy simulation; no payment or core-package integration. */
export function DemoSection({ t }: { t: Copy }) {
  return (
    <section id="demo" className="section" aria-labelledby="demo-title">
      <div className="container">
        <SectionHead id="demo-title" eyebrow={t.demo.eyebrow} title={t.demo.title} lead={t.demo.lead} />
        <PolicyDemo t={t.demo} />
      </div>
    </section>
  );
}
