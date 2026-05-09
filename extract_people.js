const fs = require('fs');
const data = fs.readFileSync('home.txt', 'utf8');

const regex = /"slug":"([^"]+)"/g;
const slugs = [];
for (const match of data.matchAll(regex)) {
  slugs.push(match[1]);
}

console.log('Unique slugs:', [...new Set(slugs)].slice(0, 20));
