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
  const inlineScript = /<script(?![^>]*\\bsrc\\s*=)[^>]*>([\\s\\S]*?)<\\/script>/gi;
  let match;
  let index = 0;
  while ((match = inlineScript.exec(html)) !== null) {
    if (!match[1].trim()) continue;
    new vm.Script(match[1], { filename: `${file}:inline-script-${++index}` });
    checked += 1;
  }
}

console.log(`Syntax checked ${checked} inline script block(s).`);
