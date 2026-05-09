const fs = require('fs');
const data = fs.readFileSync('gmail_search.txt', 'utf8');

// The search results might contain threads
const threadRegex = /\{"doc_id":"([^"]+)",(?:.*?)?(?:,"count":(\d+))?,(?:.*?)?"subject":"([^"]*)",(?:.*?)?"latest_sender_name":"([^"]*)",(?:.*?)?"latest_sender_email":"([^"]*)",(?:.*?)?"formatted_date":"([^"]*)",(?:.*?)?"preview":"([^"]*)"(?:.*?)?\}/g;

const threads = [];
for (const match of data.matchAll(threadRegex)) {
  threads.push({
    doc_id: match[1],
    subject: match[3],
    sender_name: match[4],
    sender_email: match[5],
    formatted_date: match[6],
    preview: match[7]
  });
}

const gmailUsers = {};

for (const t of threads) {
  const email = (t.sender_email || "").toLowerCase();
  if (email.includes("gmail.com")) {
    if (!gmailUsers[email]) {
      gmailUsers[email] = {
        name: t.sender_name || email,
        threads: []
      };
    }
    gmailUsers[email].threads.push(t);
  }
}

console.log(`Found ${threads.length} threads total`);
console.log(`Found ${Object.keys(gmailUsers).length} unique gmail users`);
for (const email in gmailUsers) {
  console.log(`${email}: ${gmailUsers[email].threads.length} threads`);
}
fs.writeFileSync('gmail_users.json', JSON.stringify(gmailUsers, null, 2));
