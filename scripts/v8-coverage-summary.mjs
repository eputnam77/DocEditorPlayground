import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const covDir = path.resolve('.coverage');
const files = fs.readdirSync(covDir).filter(f => f.endsWith('.json'));
const coverage = new Map();

function getLineOffsets(src) {
  const offsets = [0];
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '\n') offsets.push(i + 1);
  }
  return offsets;
}

function offsetToLine(offset, offsets) {
  let low = 0, high = offsets.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (offsets[mid] <= offset) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return high + 1; // line numbers are 1-indexed
}

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(covDir, f), 'utf8'));
  for (const script of data.result) {
    if (!script.url.startsWith('file://')) continue;
    const filePath = fileURLToPath(script.url);
    if (filePath.includes('node_modules') || filePath.includes('/tests/')) continue;
    if (!fs.existsSync(filePath)) continue;
    const ext = path.extname(filePath);
    if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) continue;
    const rel = path.relative(process.cwd(), filePath);
    let info = coverage.get(rel);
    if (!info) {
      const src = fs.readFileSync(filePath, 'utf8');
      const offsets = getLineOffsets(src);
      info = { offsets, covered: new Set() };
      coverage.set(rel, info);
    }
    const { offsets, covered } = info;
    for (const fn of script.functions) {
      for (const range of fn.ranges) {
        if (range.count === 0) continue;
        const startLine = offsetToLine(range.startOffset, offsets);
        const endLine = offsetToLine(range.endOffset - 1, offsets);
        for (let l = startLine; l <= endLine; l++) {
          covered.add(l);
        }
      }
    }
  }
}

let totalCovered = 0;
let totalLines = 0;
for (const [file, info] of coverage) {
  const lines = info.offsets.length;
  const cov = info.covered.size;
  totalLines += lines;
  totalCovered += cov;
  const pct = ((cov / lines) * 100).toFixed(2);
  console.log(`${pct}%\t${cov}/${lines}\t${file}`);
}
const totalPct = ((totalCovered / totalLines) * 100).toFixed(2);
console.log(`TOTAL ${totalPct}% (${totalCovered}/${totalLines})`);
