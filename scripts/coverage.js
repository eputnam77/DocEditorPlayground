import fs from 'fs';
import path from 'path';

const coverageDir = process.argv[2] || 'v8-coverage';
const root = process.cwd();

function lineOffsets(source) {
  const offsets = [0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') offsets.push(i + 1);
  }
  return offsets;
}

function offsetToLine(offset, offsets) {
  let low = 0, high = offsets.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (offsets[mid] <= offset) low = mid + 1; else high = mid - 1;
  }
  return high + 1; // 1-indexed line number
}

const files = new Map();
for (const file of fs.readdirSync(coverageDir)) {
  const data = JSON.parse(fs.readFileSync(path.join(coverageDir, file), 'utf8'));
  for (const script of data.result) {
    if (!script.url.startsWith('file://')) continue;
    const filepath = script.url.replace('file://', '');
    if (!filepath.startsWith(root + '/utils/')) continue;
    const rel = filepath.slice(root.length + 1);
    if (!files.has(rel)) {
      const src = fs.readFileSync(filepath, 'utf8');
      files.set(rel, { covered: new Set(), total: src.split('\n').length, src });
    }
    const entry = files.get(rel);
    const offsets = lineOffsets(entry.src);
    for (const fn of script.functions) {
      for (const range of fn.ranges) {
        if (range.count === 0) continue;
        const start = offsetToLine(range.startOffset, offsets);
        const end = offsetToLine(range.endOffset - 1, offsets);
        for (let l = start; l <= end; l++) entry.covered.add(l);
      }
    }
  }
}

let totalLines = 0;
let totalCovered = 0;
for (const [file, info] of files) {
  totalLines += info.total;
  totalCovered += info.covered.size;
  const pct = (info.covered.size / info.total) * 100;
  console.log(`${file}: ${pct.toFixed(2)}% (${info.covered.size}/${info.total})`);
}
const percent = totalCovered / totalLines * 100;
console.log(`Total coverage: ${percent.toFixed(2)}% (${totalCovered}/${totalLines})`);
