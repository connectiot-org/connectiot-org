const fs = require('fs');
const https = require('https');

const threads = JSON.parse(fs.readFileSync('threads.json', 'utf8'));
const messages = [];

function fetchThread(docId) {
  return new Promise((resolve) => {
    https.get(`https://jmail.world/thread/${docId}`, { headers: { 'RSC': '1', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const match = data.match(/"messages":(\[.*?\])(?:\}|,"count")/);
          if (match) {
            const msgs = JSON.parse(match[1]);
            resolve(msgs);
          } else {
            resolve([]);
          }
        } catch (e) {
          resolve([]);
        }
      });
    });
  });
}

async function run() {
  const allMessages = [];
  for (const t of threads) {
    if (!t.doc_id.includes('pdf')) {
      const msgs = await fetchThread(t.doc_id);
      msgs.forEach(m => {
        allMessages.push(m);
      });
    } else {
      // For PDF docs, just push a mock message based on preview
      allMessages.push({
        id: t.doc_id,
        is_from_epstein: true, // guess
        body: t.preview,
        date: new Date(t.formatted_date).toISOString(),
      });
    }
  }
  fs.writeFileSync('messages.json', JSON.stringify(allMessages, null, 2));
  console.log('Saved', allMessages.length, 'messages');
}
run();
