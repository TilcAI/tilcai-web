/**
 * Adds a `data-label` to the cells of every table in a documentation section, taken from the table's header row, so
 * the stylesheet can stack a table on a narrow column and still say what each cell is. The first column names the row
 * and is left unlabelled.
 *
 * The input is trusted repository content (src/lib/i18n/docs.*.ts): well-formed, with no nested tables.
 */
const text = (fragment: string) => fragment.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const quote = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

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
