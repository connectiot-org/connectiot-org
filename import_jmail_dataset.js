const https = require('https');
const zlib = require('zlib');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'jhatsapp', 'src', 'data', 'conversations.js');

// Helper to format name
function formatName(sender) {
  if (!sender) return "Unknown";
  // Usually "First Last <email@domain>"
  const match = sender.match(/^([^<]+)/);
  if (match) return match[1].trim();
  return sender;
}

function getSlug(sender) {
  if (!sender) return "unknown";
  const name = formatName(sender).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return name || "unknown-contact";
}

async function run() {
  console.log("Step 1: Downloading and streaming emails dataset...");
  
  const allContactsMap = new Map();
  const allConversationsMap = new Map();
  
  // We'll process max 10,000 emails for safety to avoid giant file or out of memory
  // The user can increase this limit if they have a robust frontend or split files.
  const MAX_EMAILS = 10000;
  let count = 0;

  https.get('https://data.jmail.world/v1/emails.ndjson.gz', (res) => {
    if (res.statusCode !== 200) {
      console.error('Failed to download data:', res.statusCode);
      return;
    }

    const rl = readline.createInterface({
      input: res.pipe(zlib.createGunzip()),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      if (count >= MAX_EMAILS) {
        rl.close();
        return;
      }
      
      try {
        const email = JSON.parse(line);
        count++;
        
        // Skip empty senders
        if (!email.sender) return;
        
        const slug = getSlug(email.sender);
        
        // Check if Jeffrey Epstein is sender
        let from = "them";
        const senderName = (email.sender || "").toLowerCase();
        if (email.epstein_is_sender || senderName.includes("jeffrey") || senderName.includes("epstein")) {
          from = "me";
        }
        
        // Create contact if not exists
        if (!allContactsMap.has(slug)) {
          allContactsMap.set(slug, {
            id: slug,
            name: formatName(email.sender),
            role: "Jmail Contact",
            avatar: `https://jmail.world/_next/image?url=%2Fpeople-thumbnails%2F${slug}.png&w=256&q=75`,
            msgCount: 0
          });
          
          allConversationsMap.set(slug, {
            contactId: slug,
            lastDate: "",
            lastMessage: "",
            messages: []
          });
        }
        
        const contact = allContactsMap.get(slug);
        const conversation = allConversationsMap.get(slug);
        
        const dateObj = email.sent_at ? new Date(email.sent_at) : new Date();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${days[dateObj.getDay()]}, ${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
        
        const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const shortDate = `${(dateObj.getMonth()+1).toString().padStart(2,'0')}/${dateObj.getDate().toString().padStart(2,'0')}/${dateObj.getFullYear().toString().slice(2)}`;

        const previewText = email.subject || (email.content_markdown ? email.content_markdown.substring(0, 100) : "No content");
        
        conversation.messages.push({
          id: conversation.messages.length + 1,
          from: from,
          text: previewText,
          time: timeStr,
          date: formattedDate,
          _rawDate: dateObj
        });
        
        contact.msgCount++;
        conversation.lastDate = shortDate;
        conversation.lastMessage = previewText;
        
        if (count % 1000 === 0) {
          console.log(`Processed ${count} emails...`);
        }
        
      } catch (err) {
        // Skip malformed lines
      }
    });

    rl.on('close', () => {
      console.log(`Step 2: Processing complete. Total emails parsed: ${count}`);
      
      // Sort contacts by message count and keep top 50 to avoid massive files
      const topContacts = Array.from(allContactsMap.values())
        .sort((a, b) => b.msgCount - a.msgCount)
        .slice(0, 50);
        
      const pinnedContacts = topContacts.slice(0, 10).map(c => c.id);
      
      // Filter conversations to only include top contacts and sort messages by date
      const finalConversations = {};
      
      for (const contact of topContacts) {
        const conv = allConversationsMap.get(contact.id);
        conv.messages.sort((a, b) => a._rawDate - b._rawDate);
        
        // Remove raw date
        conv.messages.forEach(m => delete m._rawDate);
        
        finalConversations[contact.id] = conv;
        
        // Clean up contact obj
        delete contact.msgCount;
      }

      console.log(`Step 3: Saving data for ${topContacts.length} contacts to conversations.js...`);
      
      const fileContent = `// Auto-generated by JhatsApp Sync Script from Official API
export const contacts = ${JSON.stringify(topContacts, null, 2)};

export const pinnedContacts = ${JSON.stringify(pinnedContacts, null, 2)};

export const conversations = ${JSON.stringify(finalConversations, null, 2)};
`;

      const dir = path.dirname(OUTPUT_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(OUTPUT_FILE, fileContent);
      console.log("✅ Successfully generated all Jmail conversations from the dataset!");
    });
  }).on('error', (err) => {
    console.error('Error fetching data:', err.message);
  });
}

run();
