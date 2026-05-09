const https = require('https');
const fs = require('fs');

https.get('https://jmail.world/', { headers: { 'RSC': '1', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('home.txt', data);
    console.log('Saved to home.txt');
    
    // Attempt to parse people array
    try {
      const match = data.match(/"people":(\[.*?\])(?:,"|\})/);
      if (match) {
        const people = JSON.parse(match[1]);
        console.log('Found', people.length, 'people');
        console.log(people.slice(0, 5));
      } else {
        console.log('Could not find people array with simple regex');
      }
    } catch(e) {
      console.log('Error parsing:', e);
    }
  });
});
