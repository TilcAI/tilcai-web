"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

// three.js is only fetched in the browser, after the hero text has rendered.
const Antigravity = dynamic(() => import("../Antigravity"), { ssr: false });

/** A WebGL failure (no GPU, blocked context) must leave the static hero background, not break the page. */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Decorative particle field behind the hero. Skipped with reduced motion, frozen while off-screen
 * or when the user pauses motion, and lighter on small screens.
 */
export function HeroBackdrop({ eventSource, paused }: { eventSource: RefObject<HTMLElement | null>; paused: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 800px)");
    const sync = () => {
      setEnabled(!motion.matches);
      setCompact(small.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    small.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      small.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className="hero-antigravity" aria-hidden="true">
      {enabled && (
        <WebGLBoundary>
          <Antigravity
            eventSource={eventSource}
            paused={paused || !visible}
            count={compact ? 150 : 520}
            magnetRadius={6}
            ringRadius={7}
            waveSpeed={0.4}
            waveAmplitude={0.6}
            particleSize={compact ? 0.55 : 1.4}
            lerpSpeed={0.05}
            color="#a98bff"
            autoAnimate
            particleVariance={1}
          />
        </WebGLBoundary>
      )}
    </div>
  );
}
