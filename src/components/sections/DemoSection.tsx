import type { Copy } from "@/lib/i18n";
import { PolicyDemo } from "../PolicyDemo";

/**
 * Visual policy simulation; no payment or core-package integration.
 * The "no funds moved" notice is not a kicker above the heading: it sits on the simulation itself, where it applies.
 */
export function DemoSection({ t }: { t: Copy }) {
  return (
    <section id="demo" className="section" aria-labelledby="demo-title">
      <div className="container">
        <header className="section-head reveal">
          <h2 id="demo-title">{t.demo.title}</h2>
          <p className="section-lead">{t.demo.lead}</p>
        </header>
        <PolicyDemo t={t.demo} />
      </div>
    </section>
  );
}
