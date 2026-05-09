const fs = require('fs');
const data = fs.readFileSync('elon.txt', 'utf8');

// The NextJS page pushes an array with JSON that contains "initialData":{"threads": [ ... ]}
let threads = [];

const regex = /"initialData":\{"threads":(\[.*?\])/;
const match = data.match(regex);
if (match) {
  try {
    // The match might be cut off or might have escaped quotes.
    // Instead, let's find the object that contains "threads":
    const jsonStr = data.substring(match.index);
    // Find the end of the array. Let's just use regex for the individual threads.
  } catch (e) {
    console.log(e);
  }
}

// Let's do a more robust approach: regex extract all thread objects
// {"doc_id":"EFTA02518458","firstMessageId":"EFTA02518458-0",...}
const threadRegex = /\{"doc_id":"([^"]+)",(?:.*?)?(?:,"count":(\d+))?,(?:.*?)?"subject":"([^"]*)",(?:.*?)?"latest_sender_name":"([^"]*)",(?:.*?)?"latest_sender_email":"([^"]*)",(?:.*?)?"formatted_date":"([^"]*)",(?:.*?)?"preview":"([^"]*)"(?:.*?)?\}/g;

const parsedThreads = [];
for (const match of data.matchAll(threadRegex)) {
  parsedThreads.push({
    doc_id: match[1],
    count: match[2],
    subject: match[3],
    sender_name: match[4],
    sender_email: match[5],
    formatted_date: match[6],
    preview: match[7]
  });
}

// Filter out duplicates
const unique = [];
const seen = new Set();
for (const t of parsedThreads) {
  if (!seen.has(t.doc_id)) {
    seen.add(t.doc_id);
    unique.push(t);
  }
}

console.log('Found threads:', unique.length);
fs.writeFileSync('threads.json', JSON.stringify(unique, null, 2));
console.log('Saved to threads.json');
