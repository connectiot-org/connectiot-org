const https = require('https');

https.get('https://jmail.world/person?page=2', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const regex = /href="\/person\/([^"?]+)"/g;
    let m;
    let slugs = new Set();
    while ((m = regex.exec(data)) !== null) {
      if (!m[1].includes('?')) slugs.add(m[1]);
    }
    console.log(Array.from(slugs));
  });
});
