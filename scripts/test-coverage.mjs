import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const covDir = mkdtempSync(path.join(tmpdir(), 'v8-'));
const env = { ...process.env, NODE_V8_COVERAGE: covDir };
const res = spawnSync('npm', ['test'], { env, stdio: 'inherit' });
if (res.status !== 0) {
  console.error('Tests failed');
  process.exit(res.status);
}

const root = process.cwd();
const files = new Map();
for (const file of readdirSync(covDir)) {
  const data = JSON.parse(readFileSync(path.join(covDir, file), 'utf8'));
  for (const script of data.result || []) {
    const url = script.url;
    if (!url || !url.startsWith('file://')) continue;
    const filePath = new URL(url).pathname;
    if (!filePath.startsWith(root)) continue;
    if (!filePath.endsWith('.ts')) continue;
    const rel = path.relative(root, filePath);
    if (!rel.startsWith('utils/')) continue;

    let stats = files.get(rel);
    if (!stats) stats = { covered: 0, total: 0 };
    const ranges = new Map();
    for (const fn of script.functions) {
      for (const r of fn.ranges) {
        const key = r.startOffset + ':' + r.endOffset;
        const prev = ranges.get(key);
        if (!prev || r.count > prev.count) {
          ranges.set(key, { count: r.count });
        }
      }
    }
    stats.total += ranges.size;
    stats.covered += [...ranges.values()].filter(r => r.count > 0).length;
    files.set(rel, stats);
  }
}

let total = 0;
let covered = 0;
for (const [file, stats] of files) {
  const pct = ((stats.covered / stats.total) * 100).toFixed(2);
  console.log(pct.padStart(6), file);
  total += stats.total;
  covered += stats.covered;
}
const overall = ((covered / total) * 100).toFixed(2);
console.log('TOTAL', overall);
rmSync(covDir, { recursive: true, force: true });
