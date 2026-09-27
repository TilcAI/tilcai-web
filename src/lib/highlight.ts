// Tiny build-time highlighters. No runtime JS, no dependencies.

export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Index of a "//" comment that is preceded by whitespace (so URLs are safe). */
function commentIndex(line: string): number {
  const m = /(^|\s)\/\//.exec(line);
  return m ? m.index + m[1].length : -1;
}

/** Highlights a JSON-like snippet (supports // comments). */
export function json(src: string): string {
  return src
    .split("\n")
    .map((line) => {
      const ci = commentIndex(line);
      const code = ci >= 0 ? line.slice(0, ci) : line;
      const comment = ci >= 0 ? line.slice(ci) : "";
      let out = esc(code).replace(
        /(&quot;[^&]*?&quot;)(\s*:)?|\b(true|false|null)\b|(-?\b\d+(?:\.\d+)?\b)|([{}\[\],:])/g,
        (m, str, colon, lit, num, punc) => {
          if (str) {
            if (colon) return `<span class="tk-key">${str}</span><span class="tk-punc">${colon}</span>`;
            const inner = str.slice(6, -6);
            const cls = /^[A-Z_]{4,}$/.test(inner) ? "tk-const" : "tk-str";
            return `<span class="${cls}">${str}</span>`;
          }
          if (lit) return `<span class="tk-bool">${lit}</span>`;
          if (num) return `<span class="tk-num">${num}</span>`;
          if (punc) return `<span class="tk-punc">${punc}</span>`;
          return m;
        },
      );
      if (comment) out += `<span class="tk-com">${esc(comment)}</span>`;
      return out;
    })
    .join("\n");
}

/** Highlights signature-style pseudo code: names before "(", comments, arrows. */
export function sig(src: string): string {
  return src
    .split("\n")
    .map((line) => {
      const ci = commentIndex(line);
      const code = ci >= 0 ? line.slice(0, ci) : line;
      const comment = ci >= 0 ? line.slice(ci) : "";
      let out = esc(code)
        .replace(/([A-Za-z_][\w.]*)\(/g, '<span class="tk-fn">$1</span>(')
        .replace(/-&gt;/g, '<span class="tk-punc">-&gt;</span>')
        .replace(/\b([A-Z][A-Za-z]+)\b(?![^<]*>)/g, '<span class="tk-type">$1</span>');
      if (comment) out += `<span class="tk-com">${esc(comment)}</span>`;
      return out;
    })
    .join("\n");
}
