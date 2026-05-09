const https = require('https');
const fs = require('fs');

https.get('https://jmail.world/person/elon-musk', { headers: { 'RSC': '1', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 1000));
    fs.writeFileSync('elon.txt', data);
    console.log('Saved to elon.txt');
  });
});
