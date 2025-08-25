import fs from 'fs';
import path from 'path';

function mergeCoverage(dir) {
  const map = new Map();
  for (const file of fs.readdirSync(dir)) {
    const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    for (const result of json.result) {
      if (!result.url.startsWith('file://')) continue;
      const filepath = result.url.replace('file://', '');
      const cwd = process.cwd();
      if (
        !filepath.startsWith(path.join(cwd, 'utils')) &&
        !filepath.startsWith(path.join(cwd, 'tests'))
      ) {
        continue;
      }
    const info = map.get(filepath) || [];
      for (const fn of result.functions) {
        for (const range of fn.ranges) info.push(range);
      }
      map.set(filepath, info);
    }
  }
  return map;
}

function rangeCoverage(ranges) {
  const uniq = new Map();
  for (const r of ranges) {
    const key = r.startOffset + ':' + r.endOffset;
    const existing = uniq.get(key) || { start: r.startOffset, end: r.endOffset, count: 0 };
    if (r.count > 0) existing.count = r.count;
    uniq.set(key, existing);
  }
  let total = 0, covered = 0;
  for (const r of uniq.values()) {
    total++;
    if (r.count > 0) covered++;
  }
  return { total, covered, pct: (covered / total) * 100 };
}

const map = mergeCoverage('.cov');
let totalCovered = 0, total = 0;
for (const [file, ranges] of map.entries()) {
  const { covered, total: t, pct } = rangeCoverage(ranges);
  totalCovered += covered;
  total += t;
  console.log(`${file} -> ${pct.toFixed(2)}% (${covered}/${t})`);
}
console.log(`TOTAL -> ${(totalCovered / total * 100).toFixed(2)}% (${totalCovered}/${total})`);
