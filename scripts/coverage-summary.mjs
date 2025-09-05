import fs from 'fs';
import path from 'path';

const root = path.resolve('.');
const covDir = path.join(root, 'coverage');
const files = fs.readdirSync(covDir).filter(f => f.endsWith('.json'));
const fileMap = new Map();
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(covDir, file), 'utf8'));
  for (const res of data.result) {
    if (!res.url || !res.url.startsWith('file://')) continue;
    const filePath = res.url.slice('file://'.length);
    if (!filePath.startsWith(root)) continue;
    if (filePath.includes('/node_modules/') || filePath.includes('/tests/') || filePath.includes('/coverage/')) continue;
    if (!fs.existsSync(filePath)) continue;
    const source = fs.readFileSync(filePath, 'utf8');
    const lines = source.split('\n');
    let info = fileMap.get(filePath);
    if (!info) {
      info = { total: lines.length, covered: new Set() };
      fileMap.set(filePath, info);
    }
    const lineStarts = [];
    let offset = 0;
    for (const line of lines) {
      lineStarts.push(offset);
      offset += line.length + 1;
    }
    for (const fn of res.functions) {
      for (const range of fn.ranges) {
        if (range.count === 0) continue;
        let i = 0;
        while (i < lineStarts.length && lineStarts[i] + lines[i].length + 1 <= range.startOffset) i++;
        for (; i < lineStarts.length && lineStarts[i] < range.endOffset; i++) {
          info.covered.add(i + 1);
        }
      }
    }
  }
}
let total = 0;
let covered = 0;
for (const [file, info] of fileMap.entries()) {
  total += info.total;
  covered += info.covered.size;
  console.log(`${path.relative(root, file)}: ${info.covered.size}/${info.total} (${(info.covered.size/info.total*100).toFixed(2)}%)`);
}
console.log(`Total: ${covered}/${total} (${(covered/total*100).toFixed(2)}%)`);
