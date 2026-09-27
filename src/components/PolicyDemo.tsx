"use client";

import { useState } from "react";
import type { Copy } from "@/lib/i18n";

export function PolicyDemo({ t }: { t: Copy["demo"] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const result = selected === null ? null : t.scenarios[selected];

  return (
    <div className="policy-demo reveal">
      <div className="demo-choices" role="group" aria-label={t.prompt}>
        <p className="demo-label">{t.prompt}</p>
        {t.scenarios.map((scenario, index) => (
          <button key={scenario.label} type="button" className={`demo-choice${selected === index ? " is-selected" : ""}`}
            aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <strong>{scenario.label}</strong>
            <span>{scenario.detail}</span>
          </button>
        ))}
      </div>
      <div className="demo-output" role="status" aria-live="polite">
        {result ? (
          <>
            <span className={`demo-outcome tone-${result.outcome.toLowerCase()}`}>{result.outcome}</span>
            <p>{result.reason}</p>
          </>
        ) : <p>{t.empty}</p>}
      </div>
      <p className="demo-caveat">{t.caveat}</p>
    </div>
  );
}
