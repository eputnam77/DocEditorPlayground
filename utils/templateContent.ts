/**
 * Template bodies, compiled into the bundle rather than fetched at runtime.
 *
 * These used to be read with `fetch("/templates/<name>.html")` from
 * `public/templates/`. That made loading a template depend on the host serving
 * an extra file: behind an authenticating proxy, under a path prefix, or from a
 * CDN that had not yet propagated, the request failed and every editor showed
 * "Failed to load template". Importing the markup removes the network hop, so a
 * template cannot fail to load once the page itself has loaded.
 *
 * The matching files under `public/templates/` are kept as the readable source
 * of record; `npm run templates:build` regenerates this module from them.
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
const softwareReleaseNotes = "<!-- Software Tech Release Notes Template -->\n<h1>Release Notes: Project Phoenix v2.3.0</h1>\n<h2>Release Date: 2025-07-15</h2>\n<p><strong>Overview:</strong> This release introduces new features, performance improvements, and bug fixes for the Phoenix platform.</p>\n<h3>1. New Features</h3>\n<ul>\n  <li><strong>Real-Time Collaboration:</strong> Multiple users can now edit documents simultaneously.</li>\n  <li><strong>Dark Mode:</strong> Added support for system and user-selected dark mode themes.</li>\n  <li><strong>API Rate Limiting:</strong> Improved backend resilience with adaptive rate limiting.</li>\n</ul>\n<h3>2. Improvements</h3>\n<ul>\n  <li>Optimized database queries for faster load times</li>\n  <li>Enhanced accessibility for screen readers</li>\n  <li>Reduced bundle size by 15%</li>\n</ul>\n<h3>3. Bug Fixes</h3>\n<ol>\n  <li>Fixed issue where notifications would not display on mobile devices</li>\n  <li>Resolved race condition in user authentication flow</li>\n  <li>Corrected typos in the onboarding tutorial</li>\n</ol>\n<h3>4. Known Issues</h3>\n<ul>\n  <li>Export to PDF may fail for documents with embedded videos</li>\n  <li>Some keyboard shortcuts are not available on Safari</li>\n</ul>\n<pre><code>// Example API usage\nfetch('/api/v2/collaborate', { method: 'POST', body: JSON.stringify({ docId }) })\n  .then(res => res.json())\n  .then(data => console.log(data));\n</code></pre>\n<h3>5. Upgrade Instructions</h3>\n<ol>\n  <li>Backup your database</li>\n  <li>Run <code>npm install project-phoenix@2.3.0</code></li>\n  <li>Restart all services</li>\n</ol>\n<p><em>Thank you for using Project Phoenix!</em></p>";
const medicalResearchArticle = "<!-- Medical Research Article Template -->\n<h1>Effects of Aerobic Exercise on Cognitive Function in Older Adults</h1>\n<h2>Abstract</h2>\n<p>This study investigates the impact of regular aerobic exercise on cognitive performance in adults aged 65 and older. Results indicate significant improvements in memory and executive function.</p>\n<h3>1. Introduction</h3>\n<p>Aging is associated with cognitive decline. Recent research suggests that physical activity may mitigate these effects.</p>\n<h3>2. Methods</h3>\n<ul>\n  <li>Participants: 120 adults, ages 65-80</li>\n  <li>Design: Randomized controlled trial</li>\n  <li>Intervention: 30 minutes of aerobic exercise, 5 days/week, for 6 months</li>\n  <li>Assessments: MMSE, Trail Making Test, Stroop Test</li>\n</ul>\n<h3>3. Results</h3>\n<ol>\n  <li>Significant improvement in MMSE scores (p &lt; 0.01)</li>\n  <li>Faster completion times on Trail Making Test</li>\n  <li>Improved Stroop Test accuracy</li>\n</ol>\n<h3>4. Discussion</h3>\n<p>Regular aerobic exercise is associated with enhanced cognitive function in older adults. Further research is needed to determine optimal exercise regimens.</p>\n<blockquote>\n  <p>\"Physical activity is a promising intervention for age-related cognitive decline.\"</p>\n</blockquote>\n<h3>5. References</h3>\n<ul>\n  <li>Smith et al., 2022. Aerobic Exercise and Cognition. <em>Journal of Aging Research</em>.</li>\n  <li>Jones & Lee, 2023. Physical Activity Interventions. <em>Neuropsychology Review</em>.</li>\n</ul>\n<p><em>End of Article</em></p>";
const legalContract = "<!-- Legal Contract Template -->\n<h1>Service Agreement</h1>\n<h2>This Service Agreement (\"Agreement\") is made effective as of July 15, 2025</h2>\n<p><strong>Between:</strong> Acme Corp. (\"Provider\")<br/>\n<strong>And:</strong> Beta LLC (\"Client\")</p>\n<h3>1. Services</h3>\n<p>The Provider agrees to perform the following services:</p>\n<ul>\n  <li>Software development</li>\n  <li>Technical support</li>\n  <li>System maintenance</li>\n</ul>\n<h3>2. Payment</h3>\n<p>The Client agrees to pay the Provider $10,000 per month, payable within 30 days of invoice.</p>\n<h3>3. Term and Termination</h3>\n<ol>\n  <li>This Agreement shall commence on the effective date and continue for 12 months.</li>\n  <li>Either party may terminate this Agreement with 30 days written notice.</li>\n</ol>\n<h3>4. Confidentiality</h3>\n<p>Both parties agree to maintain the confidentiality of proprietary information.</p>\n<h3>5. Governing Law</h3>\n<p>This Agreement shall be governed by the laws of the State of California.</p>\n<blockquote>\n  <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.</p>\n</blockquote>\n<p><em>Provider: ______________________</em></p>\n<p><em>Client: ________________________</em></p>";
export const TEMPLATES: TemplateDefinition[] = [
  {
    filename: "software-release-notes.html",
    label: "Software Release Notes",
    note: "Headings, nested lists, and a table - the structural workout.",
    html: softwareReleaseNotes,
  },
  {
    filename: "medical-research-article.html",
    label: "Medical Research Article",
    note: "Long-form academic prose with deep heading levels.",
    html: medicalResearchArticle,
  },
  {
    filename: "legal-contract-template.html",
    label: "Legal Contract",
    note: "Numbered clauses and defined terms, the way contracts nest.",
    html: legalContract,
  },
];

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
    throw new Error(`Unknown template: ${filename}`);
  }
  return template.html;
}
