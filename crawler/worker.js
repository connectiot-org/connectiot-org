const fs = require('fs');
const https = require('https');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'jhatsapp', 'public', 'data');
const THREADS_DIR = path.join(DATA_DIR, 'threads');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Ensure dirs exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(THREADS_DIR)) fs.mkdirSync(THREADS_DIR, { recursive: true });

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

function fetchUrlNoRsc(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function formatName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function run() {
  console.log("Starting Jmail Autonomous Crawler...");
  
  // Phase 1: Fetch people from Pagination
  console.log("Fetching people from pagination...");
  const slugsSet = new Set();
  for (let page = 1; page <= 5; page++) {
    console.log(`Fetching page ${page}...`);
    try {
      const pageData = await fetchUrlNoRsc(`https://jmail.world/person?page=${page}`);
      const slugRegex = /href="\/person\/([^"?]+)"/g;
      let match;
      let foundCount = 0;
      while ((match = slugRegex.exec(pageData)) !== null) {
        if (!match[1].includes('?')) {
          slugsSet.add(match[1]);
          foundCount++;
        }
      }
      if (foundCount === 0) break; // End of pages
    } catch(e) {
      console.log("Error fetching page:", e.message);
      break;
    }
  }
  const slugs = Array.from(slugsSet);
  
  console.log(`Found ${slugs.length} profiles to ingest.`);
  
  const allContacts = [];
  const pinnedContacts = [];
  
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`[${i+1}/${slugs.length}] Processing ${slug}...`);
    
    try {
      const data = await fetchUrl(`https://jmail.world/person/${slug}`);
      const threadRegex = /\{"doc_id":"([^"]+)",(?:.*?)?(?:,"count":(\d+))?,(?:.*?)?"subject":"([^"]*)",(?:.*?)?"latest_sender_name":"([^"]*)",(?:.*?)?"latest_sender_email":"([^"]*)",(?:.*?)?"formatted_date":"([^"]*)",(?:.*?)?"preview":"([^"]*)"(?:.*?)?\}/g;

      const parsedThreads = [];
      for (const match of data.matchAll(threadRegex)) {
        parsedThreads.push({
          doc_id: match[1],
          sender_name: match[4],
          sender_email: match[5],
          formatted_date: match[6],
          preview: match[7]
        });
      }

      // Deduplicate
      const unique = [];
      const seen = new Set();
      for (const t of parsedThreads) {
        if (!seen.has(t.doc_id)) {
          seen.add(t.doc_id);
          unique.push(t);
        }
      }
      unique.sort((a, b) => new Date(a.formatted_date) - new Date(b.formatted_date));

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

      const contactObj = {
        id: slug,
        name: formatName(slug),
        role: "Jmail Contact",
        avatar: `https://jmail.world/_next/image?url=%2Fpeople-thumbnails%2F${slug}.png&w=256&q=75`,
        lastDate: lastDate,
        lastMessage: lastMessage ? lastMessage.text : ""
      };

      allContacts.push(contactObj);
      if (i < 15) pinnedContacts.push(slug);

      // Save individual thread file
      const threadData = {
        contactId: slug,
        messages: messages
      };
      
      fs.writeFileSync(path.join(THREADS_DIR, `${slug}.json`), JSON.stringify(threadData, null, 2));

    } catch (err) {
      console.error(`Failed to fetch ${slug}:`, err.message);
    }
  }

  // Save contacts index
  const contactsData = {
    contacts: allContacts,
    pinnedContacts: pinnedContacts
  };
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contactsData, null, 2));

  console.log("✅ Complete! All profiles ingested into File-Based Database.");
}

run();
