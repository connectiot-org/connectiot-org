const https = require('https');

function checkPerson(slug) {
  https.get(`https://jmail.world/person/${slug}`, { headers: { 'RSC': '1', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`Found person: ${slug}, data length: ${data.length}`);
      } else {
        console.log(`Person ${slug} not found. Status: ${res.statusCode}`);
      }
    });
  });
}

checkPerson('bill-gates');
checkPerson('reid-hoffman');
checkPerson('woody-allen');
checkPerson('jeffrey-epstein');
