import fs from 'fs';
import path from 'path';

const dir = process.argv[2] || 'node_v8_coverage';
const cwd = process.cwd();

function getLineStarts(source) {
  const starts = [0];
  let index = 0;
  for (const line of source.split(/\n/)) {
    index += line.length + 1; // assume \n as line ending
    starts.push(index);
  }
  return starts;
}

function offsetToLine(starts, offset) {
  let low = 0;
  let high = starts.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (starts[mid] <= offset) low = mid + 1;
    else high = mid - 1;
  }
  return high + 1; // lines are 1-indexed
}

const fileData = new Map();

for (const file of fs.readdirSync(dir)) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  for (const script of data.result) {
    let url = script.url;
    if (url.startsWith('file://')) url = url.slice('file://'.length);
    if (!url.startsWith(cwd) || url.includes('node_modules')) continue;
    const filePath = path.resolve(url);
    if (!fs.existsSync(filePath)) continue;
    let entry = fileData.get(filePath);
    if (!entry) {
      const source = fs.readFileSync(filePath, 'utf8');
      const lines = source.split(/\n/);
      const nonEmpty = new Set();
      lines.forEach((l, i) => {
        if (l.trim() !== '') nonEmpty.add(i + 1);
      });
      entry = {
        starts: getLineStarts(source),
        nonEmpty,
        covered: new Set(),
      };
      fileData.set(filePath, entry);
    }
    const { starts, covered } = entry;
    for (const fn of script.functions) {
      for (const range of fn.ranges) {
        if (range.count === 0) continue;
        const startLine = offsetToLine(starts, range.startOffset);
        const endLine = offsetToLine(starts, range.endOffset - 1);
        for (let i = startLine; i <= endLine; i++) covered.add(i);
      }
    }
  }
}

let total = 0;
let coveredTotal = 0;
for (const [filePath, { nonEmpty, covered }] of fileData.entries()) {
  const fileCovered = [...covered].filter((l) => nonEmpty.has(l)).length;
  const fileTotal = nonEmpty.size;
  total += fileTotal;
  coveredTotal += fileCovered;
  const pct = ((fileCovered / fileTotal) * 100).toFixed(2);
  console.log(`${path.relative(cwd, filePath)}: ${fileCovered}/${fileTotal} (${pct}%)`);
}
const overall = ((coveredTotal / total) * 100).toFixed(2);
console.log(`TOTAL: ${coveredTotal}/${total} (${overall}%)`);
