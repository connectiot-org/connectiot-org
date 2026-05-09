const html = require('fs').readFileSync('d:\\JhatsApp\\jhatsapp\\index.html', 'utf8');
console.log('Has convData script tag:', html.includes('id="convData"'));
console.log('Has JSON.parse:', html.includes('JSON.parse(document.getElementById'));
console.log('No fetch call:', !html.includes("fetch("));
console.log('File size:', (html.length / 1024 / 1024).toFixed(2), 'MB');
console.log('Starts with DOCTYPE:', html.trimStart().startsWith('<!doctype'));
