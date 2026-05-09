const fs = require('fs');
const https = require('https');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'jhatsapp', 'public', 'data');
const THREADS_DIR = path.join(DATA_DIR, 'threads');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'RSC': '1', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log("Fetching all pages for Elon Musk...");
  const slug = "elon-musk";
  const urls = [
    `https://jmail.world/person/${slug}`,
    `https://jmail.world/person/${slug}/page/2`,
    `https://jmail.world/person/${slug}/page/3`
  ];
  
  let allParsedThreads = [];
  
  for (const url of urls) {
    console.log(`Fetching ${url}...`);
    try {
      const data = await fetchUrl(url);
      const threadRegex = /\{"doc_id":"([^"]+)",(?:.*?)?(?:,"count":(\d+))?,(?:.*?)?"subject":"([^"]*)",(?:.*?)?"latest_sender_name":"([^"]*)",(?:.*?)?"latest_sender_email":"([^"]*)",(?:.*?)?"formatted_date":"([^"]*)",(?:.*?)?"preview":"([^"]*)"(?:.*?)?\}/g;

      for (const match of data.matchAll(threadRegex)) {
        allParsedThreads.push({
          doc_id: match[1],
          sender_name: match[4],
          sender_email: match[5],
          formatted_date: match[6],
          preview: match[7]
        });
      }
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err.message);
    }
  }

  // Deduplicate
  const unique = [];
  const seen = new Set();
  for (const t of allParsedThreads) {
    if (!seen.has(t.doc_id)) {
      seen.add(t.doc_id);
      unique.push(t);
    }
  }
  
  // Sort by date ascending
  unique.sort((a, b) => new Date(a.formatted_date) - new Date(b.formatted_date));
  
  console.log(`Found ${unique.length} unique threads for Elon Musk.`);

  const messages = [];
  let idCounter = 1;

  for (const t of unique) {
    let from = "them";
    const name = (t.sender_name || "").toLowerCase();
    const email = (t.sender_email || "").toLowerCase();
    if (name.includes("jeffrey") || email.includes("jeffrey") || name.includes("epstein") || email.includes("epstein") || email.includes("jeevacation")) {
      from = "me";
    }

    const dateObj = new Date(t.formatted_date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${days[dateObj.getDay()]}, ${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    
    messages.push({
      id: idCounter++,
      from: from,
      text: t.preview,
      time: "12:00 PM",
      date: formattedDate
    });
  }

  const lastMessage = messages[messages.length - 1];
  let lastDate = "";
  if (lastMessage) {
    const d = new Date(unique[unique.length - 1].formatted_date);
    lastDate = `${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}/${d.getFullYear().toString().slice(2)}`;
  }

  // Save individual thread file
  const threadData = {
    contactId: slug,
    messages: messages
  };
  
  fs.writeFileSync(path.join(THREADS_DIR, `${slug}.json`), JSON.stringify(threadData, null, 2));

  // Update contacts.json
  if (fs.existsSync(CONTACTS_FILE)) {
    const contactsData = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
    const contactIndex = contactsData.contacts.findIndex(c => c.id === slug);
    if (contactIndex !== -1) {
      contactsData.contacts[contactIndex].lastDate = lastDate;
      contactsData.contacts[contactIndex].lastMessage = lastMessage ? lastMessage.text : "";
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contactsData, null, 2));
    }
  }

  console.log("✅ Complete! Elon Musk's multi-page conversations ingested successfully.");
}

run();
