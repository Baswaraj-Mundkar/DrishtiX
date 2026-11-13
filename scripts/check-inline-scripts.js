const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const htmlFiles = [
  'index.html',
  'checker.html',
  'dashboard.html',
  'login.html',
  'report.html',
  'examples.html',
  'learn.html',
  'quiz.html'
];

let checked = 0;
for (const file of htmlFiles) {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) continue;
  const html = fs.readFileSync(fullPath, 'utf8');
  const blocks = html.split('<script').slice(1);
  let index = 0;

  for (const block of blocks) {
    const tagEnd = block.indexOf('>');
    if (tagEnd < 0) continue;
    const tag = block.slice(0, tagEnd).toLowerCase();
    if (tag.includes('src=')) continue;
    const close = block.indexOf('</script>', tagEnd);
    if (close < 0) continue;
    const source = block.slice(tagEnd + 1, close);
    if (!source.trim()) continue;
    new vm.Script(source, { filename: `${file}:inline-script-${++index}` });
    checked += 1;
  }
}

console.log(`Syntax checked ${checked} inline script block(s).`);
