const fs = require('fs');
const data = fs.readFileSync('C:/Users/Adil/.gemini/antigravity/brain/76741c0e-673a-4ce8-9698-644eb2933812/.system_generated/steps/427/content.md', 'utf8');

const regex = /<loc>https:\/\/jmail\.world\/person\/([^<]+)<\/loc>/g;
const people = [];

for (const match of data.matchAll(regex)) {
  people.push(match[1]);
}

console.log('Found', people.length, 'people in sitemap 0');
console.log(people.slice(0, 10));
fs.writeFileSync('all_people_slugs.json', JSON.stringify(people, null, 2));
