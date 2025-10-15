import fs from "node:fs";
import path from "node:path";
import v8 from "node:v8";
import { fileURLToPath } from "node:url";
import type { CoverageProvider, ReportContext, Vitest } from "vitest";

interface StatementLocation {
  start: { line: number; column: number };
  end: { line: number; column: number };
}

interface FileCoverageEntry {
  filePath: string;
  relPath: string;
  lineOffsets: number[];
  statementMap: Record<string, StatementLocation>;
  s: Record<string, number>;
  lineToIds: Map<number, string[]>;
}

interface IstanbulFileCoverage {
  path: string;
  statementMap: Record<string, StatementLocation>;
  s: Record<string, number>;
  fnMap: Record<string, unknown>;
  f: Record<string, number>;
  branchMap: Record<string, unknown>;
  b: Record<string, number[]>;
}

interface CoverageResult {
  map: Record<string, IstanbulFileCoverage>;
  files: Array<{
    path: string;
    statements: number;
    covered: number;
  }>;
}

function shouldInclude(relPath: string): boolean {
  return (
    relPath.startsWith("components/") ||
    relPath.startsWith("extensions/") ||
    relPath.startsWith("pages/") ||
    relPath.startsWith("utils/") ||
    relPath.startsWith("src/")
  );
}

function computeLineOffsets(source: string): number[] {
  const offsets: number[] = [0];
  for (let i = 0; i < source.length; i += 1) {
    if (source.charCodeAt(i) === 10 /* \n */) {
      offsets.push(i + 1);
    }
  }
  if (offsets[offsets.length - 1] !== source.length) {
    offsets.push(source.length);
  }
  return offsets;
}

function offsetToLine(offsets: number[], offset: number): number {
  let low = 0;
  let high = offsets.length - 2;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const lineStart = offsets[mid];
    const nextStart = offsets[mid + 1];
    if (offset < lineStart) {
      high = mid - 1;
    } else if (offset >= nextStart) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return Math.max(0, Math.min(offsets.length - 2, low));
}

function normalisePath(p: string): string {
  return p.split(path.sep).join("/");
}

function createFileEntry(filePath: string, relPath: string): FileCoverageEntry | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const source = fs.readFileSync(filePath, "utf8");
  const lineOffsets = computeLineOffsets(source);
  const lines = source.split(/\r?\n/);
  const statementMap: Record<string, StatementLocation> = {};
  const s: Record<string, number> = {};
  const lineToIds = new Map<number, string[]>();
  let inBlockComment = false;
  let statementIndex = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const lineNumber = i + 1;
    const text = lines[i];
    const trimmed = text.trim();
    if (!trimmed) {
      continue;
    }
    if (inBlockComment) {
      if (trimmed.includes("*/")) {
        inBlockComment = false;
      }
      continue;
    }
    if (trimmed.startsWith("/*")) {
      if (!trimmed.includes("*/")) {
        inBlockComment = true;
        continue;
      }
      const remainder = trimmed.replace(/\/\*|\*\//g, "").trim();
      if (!remainder) {
        continue;
      }
    }
    if (trimmed.startsWith("//")) {
      continue;
    }
    if (/^[{}();,\[\]]+$/.test(trimmed)) {
      continue;
    }
    const id = String(statementIndex);
    statementIndex += 1;
    statementMap[id] = {
      start: { line: lineNumber, column: 0 },
      end: { line: lineNumber, column: text.length },
    };
    s[id] = 0;
    if (!lineToIds.has(lineNumber)) {
      lineToIds.set(lineNumber, []);
    }
    lineToIds.get(lineNumber)!.push(id);
  }
  return {
    filePath,
    relPath,
    lineOffsets,
    statementMap,
    s,
    lineToIds,
  };
}

function markRange(entry: FileCoverageEntry, startOffset: number, endOffset: number, count: number) {
  if (count <= 0) return;
  const start = Math.max(0, startOffset);
  const end = Math.max(start, endOffset - 1);
  const startLine = offsetToLine(entry.lineOffsets, start);
  const endLine = offsetToLine(entry.lineOffsets, end);
  for (let line = startLine; line <= endLine; line += 1) {
    const lineNumber = line + 1;
    const ids = entry.lineToIds.get(lineNumber);
    if (!ids) continue;
    for (const id of ids) {
      entry.s[id] = (entry.s[id] || 0) + count;
    }
  }
}

function collectCoverage(tempDir: string, root: string): CoverageResult {
  if (typeof v8.takeCoverage === "function") {
    v8.takeCoverage();
  }
  const files = fs.existsSync(tempDir) ? fs.readdirSync(tempDir) : [];
  const cache = new Map<string, FileCoverageEntry>();
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const fullPath = path.join(tempDir, file);
    let data: any;
    try {
      data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    } catch {
      continue;
    }
    const results: any[] = Array.isArray(data?.result) ? data.result : [];
    for (const script of results) {
      let url: string | undefined = script?.url;
      if (!url) continue;
      if (url.startsWith("file://")) {
        try {
          url = fileURLToPath(url as string);
        } catch {
          continue;
        }
      }
      if (!url.startsWith(root)) continue;
      if (url.includes("node_modules")) continue;
      const relPath = normalisePath(path.relative(root, url));
      if (!shouldInclude(relPath)) continue;
      let entry = cache.get(relPath);
      if (!entry) {
        const created = createFileEntry(url, relPath);
        if (!created) continue;
        entry = created;
        cache.set(relPath, entry);
      }
      const functions: any[] = Array.isArray(script?.functions) ? script.functions : [];
      for (const fn of functions) {
        const ranges: any[] = Array.isArray(fn?.ranges) ? fn.ranges : [];
        for (const range of ranges) {
          if (typeof range?.startOffset !== "number" || typeof range?.endOffset !== "number") {
            continue;
          }
          const count = typeof range.count === "number" ? range.count : 0;
          markRange(entry, range.startOffset, range.endOffset, count);
        }
      }
    }
  }

  const map: Record<string, IstanbulFileCoverage> = {};
  const filesSummary: CoverageResult["files"] = [];
  for (const [relPath, entry] of cache.entries()) {
    const statements = Object.keys(entry.statementMap).length;
    const covered = Object.values(entry.s).filter((value) => value > 0).length;
    map[relPath] = {
      path: relPath,
      statementMap: entry.statementMap,
      s: entry.s,
      fnMap: {},
      f: {},
      branchMap: {},
      b: {},
    };
    filesSummary.push({ path: relPath, statements, covered });
  }

  return { map, files: filesSummary };
}

function formatSummary(result: CoverageResult) {
  const lines: string[] = [];
  const header = `${"File".padEnd(60)}${"Stmts".padStart(8)}${"Missed".padStart(8)}${"Cover%".padStart(9)}`;
  lines.push(header);
  lines.push("-".repeat(header.length));
  let totalStatements = 0;
  let totalCovered = 0;
  for (const file of result.files.sort((a, b) => a.path.localeCompare(b.path))) {
    const missed = file.statements - file.covered;
    const pct = file.statements === 0 ? 100 : (file.covered / file.statements) * 100;
    const line = `${file.path.padEnd(60)}${String(file.statements).padStart(8)}${String(missed).padStart(8)}${pct.toFixed(2).padStart(9)}`;
    lines.push(line);
    totalStatements += file.statements;
    totalCovered += file.covered;
  }
  const totalMissed = totalStatements - totalCovered;
  const totalPct = totalStatements === 0 ? 100 : (totalCovered / totalStatements) * 100;
  lines.push("-".repeat(header.length));
  lines.push(
    `${"All files".padEnd(60)}${String(totalStatements).padStart(8)}${String(totalMissed).padStart(8)}${totalPct
      .toFixed(2)
      .padStart(9)}`,
  );
  return {
    lines,
    totals: {
      statements: {
        total: totalStatements,
        covered: totalCovered,
        skipped: 0,
        pct: Number(totalPct.toFixed(2)),
      },
    },
  };
}

class SimpleV8CoverageProvider implements CoverageProvider {
  name = "custom-v8";
  ctx: Vitest | undefined;
  tempDir = "";
  reportsDir = "";

  initialize(ctx: Vitest) {
    this.ctx = ctx;
    const root = ctx.config.root ?? process.cwd();
    this.tempDir = path.resolve(root, ".coverage-temp");
    this.reportsDir = path.resolve(root, "reports/coverage");
    fs.rmSync(this.tempDir, { recursive: true, force: true });
    fs.mkdirSync(this.tempDir, { recursive: true });
    fs.rmSync(this.reportsDir, { recursive: true, force: true });
    fs.mkdirSync(this.reportsDir, { recursive: true });
    process.env.NODE_V8_COVERAGE = this.tempDir;
  }

  resolveOptions() {
    return {
      enabled: true,
      reportsDirectory: this.reportsDir,
      reporter: ["text-summary"],
      clean: false,
      all: false,
      allowExternal: true,
    } as const;
  }

  async clean(clean = true) {
    if (!clean) return;
    if (this.tempDir) {
      fs.rmSync(this.tempDir, { recursive: true, force: true });
    }
  }

  async onAfterSuiteRun() {}

  async reportCoverage(_reportContext?: ReportContext) {
    const root = this.ctx?.config.root ?? process.cwd();
    const result = collectCoverage(this.tempDir, root);
    const summary = formatSummary(result);
    for (const line of summary.lines) {
      console.log(line);
    }
    const finalPath = path.join(this.reportsDir, "coverage-final.json");
    fs.writeFileSync(finalPath, JSON.stringify(result.map, null, 2), "utf8");
    const summaryPath = path.join(this.reportsDir, "coverage-summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(summary.totals, null, 2), "utf8");
    const rows = result.files
      .slice()
      .sort((a, b) => a.path.localeCompare(b.path))
      .map((file) => {
        const missed = file.statements - file.covered;
        const pct = file.statements === 0 ? 100 : (file.covered / file.statements) * 100;
        return `<tr><td>${file.path}</td><td>${file.statements}</td><td>${missed}</td><td>${pct.toFixed(
          2,
        )}%</td></tr>`;
      })
      .join("");
    const total = summary.totals.statements;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Coverage Summary</title>
<style>body{font-family:system-ui, sans-serif;padding:2rem;background:#f7fafc;color:#1a202c;}table{border-collapse:collapse;width:100%;max-width:960px;margin:auto;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.1);}th,td{padding:0.5rem 0.75rem;text-align:left;border-bottom:1px solid #e2e8f0;}th{background:#edf2f7;font-weight:600;}tfoot td{font-weight:700;background:#f1f5f9;}</style>
</head><body><h1>Coverage Summary</h1><table><thead><tr><th>File</th><th>Statements</th><th>Missed</th><th>Coverage</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td>All files</td><td>${total.total}</td><td>${
      total.total - total.covered
    }</td><td>${total.pct.toFixed(2)}%</td></tr></tfoot></table></body></html>`;
    const htmlPath = path.join(this.reportsDir, "index.html");
    fs.writeFileSync(htmlPath, html, "utf8");
  }
}

export default {
  getProvider() {
    return new SimpleV8CoverageProvider();
  },
};
