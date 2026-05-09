const fs = require('fs');

const rawData = fs.readFileSync('jmail.json', 'utf8');
const data = JSON.parse(rawData);

let allMessages = [];
let unparseable = 0;

for (const thread of data) {
  if (thread.messages) {
    try {
      const parsed = JSON.parse(thread.messages);
      allMessages.push(...parsed);
    } catch (e) {
      unparseable++;
    }
  }
}

console.log(`Total threads: ${data.length}`);
console.log(`Unparseable messages field: ${unparseable}`);
console.log(`Total messages extracted: ${allMessages.length}`);

// Let's see some senders
const senders = new Set(allMessages.map(m => m.sender).filter(Boolean));
console.log(`Unique senders: ${senders.size}`);
console.log(`Some senders:`, Array.from(senders).slice(0, 10));

// Test timestamp parsing
const sampleTimestamps = allMessages.slice(0, 20).map(m => m.timestamp);
console.log(`Sample timestamps:`, sampleTimestamps);
