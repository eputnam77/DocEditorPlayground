/**
 * Regenerate utils/templateContent.ts from the HTML files in public/templates/.
 *
 * The editors import their template bodies instead of fetching them, so the
 * markup has to be compiled into a module. Editing a file under
 * public/templates/ therefore has no effect until this script is run:
 *
 *     npm run templates:build
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Template registry. Order here is the order in the picker. */
const TEMPLATES = [
  {
    constName: "softwareReleaseNotes",
    filename: "software-release-notes.html",
    label: "Software Release Notes",
    note: "Headings, nested lists, and a table - the structural workout.",
  },
  {
    constName: "medicalResearchArticle",
    filename: "medical-research-article.html",
    label: "Medical Research Article",
    note: "Long-form academic prose with deep heading levels.",
  },
  {
    constName: "legalContract",
    filename: "legal-contract-template.html",
    label: "Legal Contract",
    note: "Numbered clauses and defined terms, the way contracts nest.",
  },
];

const header = `/**
 * Template bodies, compiled into the bundle rather than fetched at runtime.
 *
 * These used to be read with \`fetch("/templates/<name>.html")\` from
 * \`public/templates/\`. That made loading a template depend on the host serving
 * an extra file: behind an authenticating proxy, under a path prefix, or from a
 * CDN that had not yet propagated, the request failed and every editor showed
 * "Failed to load template". Importing the markup removes the network hop, so a
 * template cannot fail to load once the page itself has loaded.
 *
 * The matching files under \`public/templates/\` are kept as the readable source
 * of record; \`npm run templates:build\` regenerates this module from them.
 */

export interface TemplateDefinition {
  /** Stable identifier, also the filename under public/templates/. */
  filename: string;
  /** Name shown in the template picker. */
  label: string;
  /** One line on what the template is useful for testing. */
  note: string;
  /** The template body as HTML. */
  html: string;
}
`;

const footer = `
export const TEMPLATE_BY_FILENAME: Record<string, TemplateDefinition> =
  Object.fromEntries(TEMPLATES.map((template) => [template.filename, template]));

/**
 * Return a template body by filename.
 *
 * Throws rather than returning undefined so callers surface a real error
 * instead of quietly clearing the editor.
 */
export function getTemplateHtml(filename: string): string {
  const template = TEMPLATE_BY_FILENAME[filename];
  if (!template) {
    throw new Error(\`Unknown template: \${filename}\`);
  }
  return template.html;
}
`;

const chunks = [header];

for (const template of TEMPLATES) {
  const source = path.join(repoRoot, "public", "templates", template.filename);
  const html = readFileSync(source, "utf8").trim();
  // JSON string literals need no backtick or ${ escaping, unlike template
  // literals, so the body is emitted as JSON and inlined by the compiler.
  chunks.push(`const ${template.constName} = ${JSON.stringify(html)};\n`);
}

chunks.push("export const TEMPLATES: TemplateDefinition[] = [\n");
for (const template of TEMPLATES) {
  chunks.push(
    "  {\n" +
      `    filename: ${JSON.stringify(template.filename)},\n` +
      `    label: ${JSON.stringify(template.label)},\n` +
      `    note: ${JSON.stringify(template.note)},\n` +
      `    html: ${template.constName},\n` +
      "  },\n",
  );
}
chunks.push("];\n");
chunks.push(footer);

const outPath = path.join(repoRoot, "utils", "templateContent.ts");
writeFileSync(outPath, chunks.join(""), "utf8");
console.log(`Wrote ${path.relative(repoRoot, outPath)} from ${TEMPLATES.length} templates.`);
