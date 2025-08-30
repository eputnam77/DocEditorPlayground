import fs from 'fs';
import path from 'path';

const coverageDir = path.resolve('./coverage');
const files = fs.readdirSync(coverageDir).filter(f => f.endsWith('.json'));
const fileCoverage = new Map();
const projectDir = path.resolve('.');

function markLines(url, start, end, content){
  if(!fileCoverage.has(url)){
    const lines = content.split('\n').map(()=>({covered:false, text:''}));
    lines.forEach((_,i)=>{ lines[i].text = content.split('\n')[i]; });
    fileCoverage.set(url, lines);
  }
  const arr = fileCoverage.get(url);
  // Precompute line start offsets
  const lineOffsets = []; let offset=0; const lines=content.split('\n');
  for(const line of lines){ lineOffsets.push(offset); offset += line.length+1; }
  for(let i=0;i<lines.length;i++){
    const lineStart=lineOffsets[i];
    const lineEnd=i===lines.length-1?content.length:lineOffsets[i+1];
    if(Math.min(end,lineEnd) > Math.max(start,lineStart)){
      arr[i].covered = true;
    }
  }
}

for(const file of files){
  const data = JSON.parse(fs.readFileSync(path.join(coverageDir,file),'utf8'));
  for(const script of data.result){
    if(!script.url.startsWith('file://')) continue;
    const filePath = new URL(script.url).pathname;
    const includeDirs = ['utils', 'components'];
    if(!includeDirs.some(dir => filePath.startsWith(path.join(projectDir, dir)))) continue;
    const content = fs.readFileSync(filePath,'utf8');
    for(const fn of script.functions){
      for(const range of fn.ranges){
        if(range.count>0){
          markLines(filePath, range.startOffset, range.endOffset, content);
        }
      }
    }
  }
}

let total=0, covered=0;
for(const [url, lines] of fileCoverage.entries()){
  const filtered = lines.filter(l => l.text.trim() !== '');
  const fileCovered = filtered.filter(l=>l.covered).length;
  const fileTotal = filtered.length;
  total += fileTotal; covered += fileCovered;
  const pct = ((fileCovered/fileTotal)*100).toFixed(2);
  console.log(`${path.relative('.', url)}: ${fileCovered}/${fileTotal} (${pct}%)`);
}
const pctTotal = ((covered/total)*100).toFixed(2);
console.log(`TOTAL: ${covered}/${total} (${pctTotal}%)`);
