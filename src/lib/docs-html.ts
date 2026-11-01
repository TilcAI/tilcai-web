/**
 * Adds a `data-label` to the cells of every table in a documentation section, taken from the table's header row, so
 * the stylesheet can stack a table on a narrow column and still say what each cell is. The first column names the row
 * and is left unlabelled.
 *
 * The input is trusted repository content (src/lib/i18n/docs.*.ts): well-formed, with no nested tables.
 */
const text = (fragment: string) => fragment.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const quote = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/** Unique article headings; input is trusted repository HTML. */
export function prepareDocArticle(html: string, locale: "es" | "en") {
  const headings: { id: string; title: string }[] = [];
  const used = new Set<string>();
  const body = labelTableCells(html).replace(/<h3\b([^>]*)>([\s\S]*?)<\/h3>/g, (_match, attrs: string, inner: string) => {
    const title = text(inner);
    const stem = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    let id = stem;
    for (let i = 2; used.has(id); i++) id = `${stem}-${i}`;
    used.add(id);
    headings.push({ id, title });
    return `<h2 class="doc-subheading"${attrs.replace(/\s+id="[^"]*"/, "")} id="${id}">${inner}</h2>`;
  }).replace(new RegExp(`href="/${locale}/docs#([a-z-]+)"`, "g"), `href="/${locale}/docs/$1"`);
  return { html: body, headings };
}

export function labelTableCells(html: string): string {
  return html.replace(/<table\b[^>]*>[\s\S]*?<\/table>/g, (table) => {
    const head = /<thead\b[^>]*>([\s\S]*?)<\/thead>/.exec(table);
    if (!head) return table;
    const labels = [...head[1].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((match) => text(match[1]));
    return table.replace(/<tbody\b[^>]*>[\s\S]*?<\/tbody>/, (body) =>
      body.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/g, (row) => {
        let column = -1;
        return row.replace(/<(td|th)\b([^>]*)>/g, (cell, tag: string, attributes: string) => {
          column += 1;
          const label = labels[column];
          if (tag !== "td" || column === 0 || !label || /\bdata-label=/.test(attributes)) return cell;
          return `<td${attributes} data-label="${quote(label)}">`;
        });
      }),
    );
  });
}
