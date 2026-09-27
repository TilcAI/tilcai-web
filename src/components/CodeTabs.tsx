"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";

export interface CodeTab {
  id: string;
  name: string;
  caption: string;
  /** Pre-highlighted HTML generated at build time from trusted snippets. */
  html: string;
}

export function CodeTabs({ tabs, label, ariaLabel }: { tabs: CodeTab[]; label: string; ariaLabel: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="code-window reveal">
      <div className="code-bar">
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="tabs" role="tablist" aria-label={ariaLabel}>
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <p className="code-label">
        <Icon name="lock" />
        {label}
      </p>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          className={i === active ? "code-panel" : "code-panel is-hidden"}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={0}
        >
          <p className="code-caption">{tab.caption}</p>
          <pre className="code">
            <code dangerouslySetInnerHTML={{ __html: tab.html }} />
          </pre>
        </div>
      ))}
    </div>
  );
}
