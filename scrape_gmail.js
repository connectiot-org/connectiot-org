const https = require('https');
const fs = require('fs');

https.get('https://jmail.world/search?q=gmail.com', { headers: { 'RSC': '1', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('gmail_search.txt', data);
    console.log('Saved to gmail_search.txt');
  });
});
