import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve('.');
const COVERAGE_DIR = path.resolve('.v8-coverage');

function listCoverageFiles(dir) {
  try {
    return fs.readdirSync(dir).map((name) => path.join(dir, name));
  } catch (err) {
    console.error(`Failed to read coverage directory ${dir}:`, err);
    process.exitCode = 1;
    return [];
  }
}

function createFileInfo(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const lines = source.split(/\r?\n/);
  const lineOffsets = new Array(lines.length);
  const lineLengths = new Array(lines.length);
  const trackable = new Array(lines.length).fill(false);
  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    lineOffsets[i] = offset;
    const line = lines[i];
    lineLengths[i] = line.length;
    if (line.trim().length > 0) {
      trackable[i] = true;
    }
    offset += line.length + 1;
  }
  return {
    source,
    lines,
    lineOffsets,
    lineLengths,
    trackable,
    counts: new Array(lines.length).fill(0),
  };
}

function offsetToLine(offset, offsets, lengths) {
  let low = 0;
  let high = offsets.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const start = offsets[mid];
    const end = start + lengths[mid];
    const endInclusive = end + 1;
    if (offset < start) {
      high = mid - 1;
    } else if (offset >= endInclusive) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return Math.max(0, Math.min(offsets.length - 1, low));
}

function shouldInclude(filePath) {
  if (!filePath.startsWith(ROOT)) return false;
  if (filePath.includes(`${path.sep}node_modules${path.sep}`)) return false;
  if (filePath.includes(`${path.sep}tests${path.sep}`)) return false;
  if (filePath.includes(`${path.sep}.next${path.sep}`)) return false;
  if (filePath.includes(`${path.sep}playwright${path.sep}`)) return false;
  if (filePath.includes(`${path.sep}.v8-coverage${path.sep}`)) return false;
  if (filePath.includes(`${path.sep}.git${path.sep}`)) return false;
  const relative = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (
    relative.startsWith('components/') ||
    relative.startsWith('extensions/') ||
    relative.startsWith('utils/') ||
    relative.startsWith('pages/')
  ) {
    return /\.(ts|tsx)$/.test(relative);
  }
  return false;
}

const fileCache = new Map();

for (const file of listCoverageFiles(COVERAGE_DIR)) {
  const raw = fs.readFileSync(file, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.warn(`Skipping malformed coverage file ${file}:`, err);
    continue;
  }
  for (const entry of data.result || []) {
    if (typeof entry.url !== 'string') continue;
    if (!entry.url.startsWith('file://')) continue;
    const filePath = fileURLToPath(entry.url);
    if (!shouldInclude(filePath)) continue;
    if (!fs.existsSync(filePath)) continue;
    let info = fileCache.get(filePath);
    if (!info) {
      info = createFileInfo(filePath);
      fileCache.set(filePath, info);
    }
    for (const fn of entry.functions || []) {
      const ranges = fn.ranges || [];
      const startIndex = fn.isBlockCoverage && ranges.length > 1 ? 1 : 0;
      for (let idx = startIndex; idx < ranges.length; idx++) {
        const range = ranges[idx];
        if (!range) continue;
        const count = range.count ?? 0;
        let start = range.startOffset ?? 0;
        let end = range.endOffset ?? start;
        if (end <= start) continue;
        if (end > info.source.length) {
          end = info.source.length;
        }
        const startLine = offsetToLine(start, info.lineOffsets, info.lineLengths);
        const endLine = offsetToLine(Math.max(start, end - 1), info.lineOffsets, info.lineLengths);
        for (let line = startLine; line <= endLine; line++) {
          info.counts[line] = Math.max(info.counts[line], count);
        }
      }
    }
  }
}

let totalCovered = 0;
let totalTrackable = 0;
const summaries = [];
for (const [filePath, info] of fileCache) {
  let fileTrackable = 0;
  let fileCovered = 0;
  for (let i = 0; i < info.lines.length; i++) {
    if (!info.trackable[i]) continue;
    fileTrackable++;
    if (info.counts[i] > 0) fileCovered++;
  }
  if (fileTrackable === 0) continue;
  totalTrackable += fileTrackable;
  totalCovered += fileCovered;
  const pct = fileCovered === 0 ? 0 : (fileCovered / fileTrackable) * 100;
  summaries.push({ file: path.relative(ROOT, filePath), covered: fileCovered, total: fileTrackable, pct });
}

summaries.sort((a, b) => a.file.localeCompare(b.file));
for (const summary of summaries) {
  console.log(`${summary.file}: ${summary.covered}/${summary.total} (${summary.pct.toFixed(2)}%)`);
}

const overallPct = totalTrackable === 0 ? 0 : (totalCovered / totalTrackable) * 100;
console.log(`\nOverall line coverage: ${totalCovered}/${totalTrackable} (${overallPct.toFixed(2)}%)`);
