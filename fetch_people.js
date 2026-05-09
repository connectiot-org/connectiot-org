const https = require('https');
const fs = require('fs');

const people = ['bill-gates', 'reid-hoffman', 'woody-allen'];
const allData = {};

async function fetchPerson(slug) {
  return new Promise((resolve) => {
    https.get(`https://jmail.world/person/${slug}`, { headers: { 'RSC': '1', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve(data);
      });
    });
  });
}

async function run() {
  for (const slug of people) {
    console.log('Fetching', slug);
    const data = await fetchPerson(slug);
    
    // Extract threads
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

    // deduplicate threads
    const unique = [];
    const seen = new Set();
    for (const t of parsedThreads) {
      if (!seen.has(t.doc_id)) {
        seen.add(t.doc_id);
        unique.push(t);
      }
    }
    
    // Convert to WhatsApp format
    unique.sort((a, b) => new Date(a.formatted_date) - new Date(b.formatted_date));

    const messages = [];
    let idCounter = 1;

    for (const t of unique) {
      let from = "them";
      const name = (t.sender_name || "").toLowerCase();
      const email = (t.sender_email || "").toLowerCase();
      
      if (name.includes("jeffrey") || email.includes("jeffrey") || name.includes("epstein") || email.includes("epstein") || email.includes("jeevacation")) {
        from = "me";
      } else {
        from = "them";
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
        date: formattedDate,
        original_date: t.formatted_date
      });
    }

    allData[slug] = messages;
  }
  fs.writeFileSync('people_messages.json', JSON.stringify(allData, null, 2));
  console.log('Done');
}

run();
