const fs = require('fs');

const rawData = fs.readFileSync('d:\\JhatsApp\\jmail.json', 'utf8');
const threads = JSON.parse(rawData);

// ========== HELPERS ==========

// Check if a string contains Jeffrey Epstein's email
function isJeffrey(str) {
  if (!str) return false;
  return /jeevacation@gmail\.com/i.test(str);
}

// Clean display name: remove email parts like <email> and [email]
function cleanName(str) {
  if (!str) return null;
  let name = str
    .replace(/<[^>]*>/g, '')   // remove <...>
    .replace(/\[[^\]]*\]/g, '') // remove [...]
    .replace(/\([^)]*\)/g, '') // remove (...)
    .replace(/\b\d{1,2}[=:].*/g, '') // remove stuff like "11=1"
    .replace(/:MM\d+/g, '')   // remove :MM11 type artifacts
    .replace(/_+/g, '')       // remove underscores
    .replace(/\|.*/g, '')     // remove pipe and everything after
    .replace(/\bnn\b/gi, '')  // remove stray "nn"
    .replace(/\bPD\b/gi, '')  // remove stray "PD"
    .replace(/\bPF\b/gi, '')  // remove stray "PF"
    .replace(/\bTS\b/gi, '')  // remove stray "TS"
    .replace(/\bae\b/gi, '')  // remove stray "ae"
    .replace(/\bis\b/gi, '')  // remove stray "is"
    .trim();
  // Remove trailing punctuation artifacts
  name = name.replace(/[,;:\s!?.\-]+$/, '').trim();
  // Remove leading articles/prepositions that are artifacts
  name = name.replace(/^[,;:\s!?.\-]+/, '').trim();
  // Collapse multiple spaces
  name = name.replace(/\s+/g, ' ');
  if (!name || name.length < 2) return null;
  return name;
}

// Normalize contact names that refer to the same person
function normalizeContactName(name) {
  if (!name) return null;
  const lower = name.toLowerCase().trim();

  // Filter out spam / newsletter / automated senders
  const spamPatterns = [
    'flipboard', 'quora', 'digest', 'noreply', 'no-reply', 'mailer-daemon',
    'jpmorgan', 'newsletter', '@', 'undisclosed', 'editorialstaff'
  ];
  for (const pat of spamPatterns) {
    if (lower.includes(pat)) return null;
  }

  // Map known variations to canonical names
  const nameMap = {
    'j': 'Jeffrey Epstein',
    'j jep': 'Jeffrey Epstein',
    'je vacation': 'Jeffrey Epstein',
    'jeffrey e.': 'Jeffrey Epstein',
    'jeffrey e': 'Jeffrey Epstein',
    'jeffrey epstein': 'Jeffrey Epstein',
    'jefffrey epstein': 'Jeffrey Epstein',
    'story': 'Jeffrey Epstein',
    'gmax': 'Ghislaine Maxwell',
    'g maxwell': 'Ghislaine Maxwell',
    'ny max': 'Ghislaine Maxwell',
    'thomas jr., landon': 'Landon Thomas Jr.',
    'thomas jr., lando': 'Landon Thomas Jr.',
    'thomas jr., landon i.': 'Landon Thomas Jr.',
    'landon thomas jr.': 'Landon Thomas Jr.',
    'landon thomas, jr.': 'Landon Thomas Jr.',
    'robert kuhn': 'Robert Lawrence Kuhn',
    'robert lawrence kuhn': 'Robert Lawrence Kuhn',
    'weingarten, reid': 'Reid Weingarten',
    'martin g. weinberg': 'Martin Weinberg',
    'martin weinberg': 'Martin Weinberg',
    'richard kahr': 'Richard Kahn',
    'richard kahn': 'Richard Kahn',
    'lhs': 'Larry Summers',
    'larry summers': 'Larry Summers',
    'joi ito': 'Joichi Ito',
    'joichi ito': 'Joichi Ito',
    'nicholas ribis': 'Nicholas Ribis',
    'nicholas ribis ts': 'Nicholas Ribis',
    'michael wolff': 'Michael Wolff',
    'kathy ruemmler': 'Kathy Ruemmler',
    'kathy ruemmeli': 'Kathy Ruemmler',
    'kathy ruemmier': 'Kathy Ruemmler',
    'darren indyke': 'Darren Indyke',
    'larry visoski': 'Larry Visoski',
    'larry visoski pf': 'Larry Visoski',
    'larry': 'Larry Visoski',
    'cs': 'Larry Visoski',
    'alan dershowitz': 'Alan Dershowitz',
    'brad edward': 'Brad Edwards',
    'peter thomas roth': 'Peter Thomas Roth',
    'sultan bin sulayer': 'Sultan Bin Sulayem',
    'anil ambani': 'Anil Ambani',
    'robert trivers': 'Robert Trivers',
    'lesley groff': 'Lesley Groff',
    'lesley groff pd': 'Lesley Groff',
    'lesley groff iii iiiii': 'Lesley Groff',
    'lesley grof': 'Lesley Groff',
    'lesley grof a': 'Lesley Groff',
    'lesley groft': 'Lesley Groff',
    'lesley gott': 'Lesley Groff',
    'lesley croft': 'Lesley Groff',
    'viet lesley croft': 'Lesley Groff',
    'jean.huguen i: lesley gott': 'Lesley Groff',
    'sean j. lancaster': 'Sean Lancaster',
    'peter aldhous': 'Peter Aldhous',
    'jack ang': 'Jack Ang',
    'cc': 'CC',
    'iin': 'CC',
    'bs stern': 'BS Stern',
    'boris nikolic': 'Boris Nikolic',
    'mark green': 'Mark Green',
    'mark cohen': 'Mark Cohen',
    'peggy siegal': 'Peggy Siegal',
    'tyler shears': 'Tyler Shears',
    'christina galbraith': 'Christina Galbraith',
    'philip levine': 'Philip Levine',
    'diane ziman': 'Diane Ziman',
    'zubair khan': 'Zubair Khan',
    'faith kates': 'Faith Kates',
    'ed boyden': 'Ed Boyden',
    'lisa new': 'Lisa New',
    'melanie walker': 'Melanie Walker',
    'jonathan farkas': 'Jonathan Farkas',
    'larry visoski pf': 'Larry Visoski',
  };

  // Try exact match on lowercased name
  if (nameMap[lower]) return nameMap[lower];

  // Try partial matches for known variants (only if both are 2+ words)
  const lowerWords = lower.split(/\s+/);
  for (const [key, canonical] of Object.entries(nameMap)) {
    const keyWords = key.split(/\s+/);
    // Match if name starts with the key (to catch "Lesley Groff (iii iiiii-" -> "Lesley Groff")
    if (lowerWords.length >= 2 && keyWords.length >= 2) {
      if (lowerWords[0] === keyWords[0] && lowerWords[1] === keyWords[1]) {
        return canonical;
      }
    }
    if (lower.startsWith(key + ' ') || key.startsWith(lower + ' ')) {
      return canonical;
    }
    if (lower === key) return canonical;
  }

  // Return original (title-cased if needed)
  return name;
}

// Parse various timestamp formats into a Date object
function parseTimestamp(ts) {
  if (!ts) return null;

  let cleaned = ts.trim();

  // Remove "at" between date and time: "Jan 9, 2015 at 1:20 PM" -> "Jan 9, 2015 1:20 PM"
  cleaned = cleaned.replace(/\s+at\s+/gi, ' ');

  // Try direct parsing first
  let d = new Date(cleaned);
  if (!isNaN(d.getTime()) && d.getFullYear() > 1990 && d.getFullYear() < 2030) {
    return d;
  }

  // Handle "M/D/YYYY H:MM:SS AM/PM" format
  const usFormat = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(.+)$/);
  if (usFormat) {
    d = new Date(`${usFormat[1]}/${usFormat[2]}/${usFormat[3]} ${usFormat[4]}`);
    if (!isNaN(d.getTime())) return d;
  }

  // Handle formats with timezone names like "Eastern Daylight Time"
  const tzClean = cleaned
    .replace(/Eastern Daylight Time/gi, 'EDT')
    .replace(/Eastern Standard Time/gi, 'EST')
    .replace(/Pacific Daylight Time/gi, 'PDT')
    .replace(/Pacific Standard Time/gi, 'PST');
  d = new Date(tzClean);
  if (!isNaN(d.getTime()) && d.getFullYear() > 1990) return d;

  // Handle Norwegian/French/German date formats
  // "fre. 17. feb. 2017 kl. 21.27" or "Le 10 juil. 2017 a 23:17" etc.
  const monthMap = {
    'jan': 'Jan', 'feb': 'Feb', 'mar': 'Mar', 'mars': 'Mar',
    'apr': 'Apr', 'avr': 'Apr', 'mai': 'May', 'may': 'May',
    'jun': 'Jun', 'juin': 'Jun', 'jul': 'Jul', 'juil': 'Jul',
    'aug': 'Aug', 'aout': 'Aug', 'août': 'Aug',
    'sep': 'Sep', 'sept': 'Sep', 'oct': 'Oct',
    'nov': 'Nov', 'dec': 'Dec', 'déc': 'Dec',
    'fevr': 'Feb', 'févr': 'Feb'
  };

  // Try to extract day, month-name, year and time from non-English formats
  const foreignMatch = cleaned.match(/(\d{1,2})[\.\s]+(\w+)[\.\s]+(\d{4})[\s\w\.]*?(\d{1,2})[:\.](\d{2})(?:[:\.](\d{2}))?/i);
  if (foreignMatch) {
    const day = foreignMatch[1];
    const monthStr = foreignMatch[2].toLowerCase().replace(/\./g, '');
    const year = foreignMatch[3];
    const hour = foreignMatch[4];
    const min = foreignMatch[5];
    const sec = foreignMatch[6] || '00';
    const month = monthMap[monthStr];
    if (month) {
      d = new Date(`${month} ${day}, ${year} ${hour}:${min}:${sec}`);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // "Le 29 nov. 2016 a 00:16" style
  const frMatch = cleaned.match(/(\d{1,2})\s+(\w+)\.?\s+(\d{4})\s+[aà]\s+(\d{1,2})[:\.](\d{2})/i);
  if (frMatch) {
    const day = frMatch[1];
    const monthStr = frMatch[2].toLowerCase().replace(/\./g, '');
    const year = frMatch[3];
    const hour = frMatch[4];
    const min = frMatch[5];
    const month = monthMap[monthStr];
    if (month) {
      d = new Date(`${month} ${day}, ${year} ${hour}:${min}:00`);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // German: "Am 23.07.2016 um 04:41" or "23.07.2016 um 04:41"
  const deMatch = cleaned.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(?:um\s+)?(\d{1,2}):(\d{2})/i);
  if (deMatch) {
    d = new Date(`${deMatch[2]}/${deMatch[1]}/${deMatch[3]} ${deMatch[4]}:${deMatch[5]}:00`);
    if (!isNaN(d.getTime())) return d;
  }

  // "3 apr. 2018 kl. 16:29"
  const klMatch = cleaned.match(/(\d{1,2})\s+(\w+)\.?\s+(\d{4})\s+kl\.?\s+(\d{1,2})[:\.](\d{2})/i);
  if (klMatch) {
    const day = klMatch[1];
    const monthStr = klMatch[2].toLowerCase().replace(/\./g, '');
    const year = klMatch[3];
    const hour = klMatch[4];
    const min = klMatch[5];
    const month = monthMap[monthStr];
    if (month) {
      d = new Date(`${month} ${day}, ${year} ${hour}:${min}:00`);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // "25 Aug 2017, at 09.49"
  const dotTimeMatch = cleaned.match(/(\d{1,2})\s+(\w+)\s+(\d{4}),?\s+(\d{1,2})\.(\d{2})/i);
  if (dotTimeMatch) {
    d = new Date(`${dotTimeMatch[2]} ${dotTimeMatch[1]}, ${dotTimeMatch[3]} ${dotTimeMatch[4]}:${dotTimeMatch[5]}:00`);
    if (!isNaN(d.getTime())) return d;
  }

  // "8 fevr. 2017, at 12:59"
  const fMatch2 = cleaned.match(/(\d{1,2})\s+(\w+)\.?\s+(\d{4}),?\s+(\d{1,2}):(\d{2})/i);
  if (fMatch2) {
    const day = fMatch2[1];
    const monthStr = fMatch2[2].toLowerCase().replace(/\./g, '');
    const year = fMatch2[3];
    const hour = fMatch2[4];
    const min = fMatch2[5];
    const month = monthMap[monthStr];
    if (month) {
      d = new Date(`${month} ${day}, ${year} ${hour}:${min}:00`);
      if (!isNaN(d.getTime())) return d;
    }
  }

  return null; // Could not parse
}

function formatDate(d) {
  if (!d) return null;
  const pad = n => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ========== MAIN PROCESSING ==========

// Step 1: Process each thread to identify the primary contact and collect messages
const contactConversations = {};
let skippedSpam = 0;
let skippedNoContact = 0;

for (const thread of threads) {
  if (!thread.messages) continue;

  let messages;
  try {
    messages = JSON.parse(thread.messages);
  } catch (e) {
    continue;
  }

  if (!messages || messages.length === 0) continue;

  // Identify all non-Jeffrey participants in this thread
  const participants = new Set();

  for (const msg of messages) {
    const sender = msg.sender || '';
    const recipients = msg.recipients || [];

    if (!isJeffrey(sender)) {
      const name = cleanName(sender);
      if (name) {
        const normalized = normalizeContactName(name);
        if (normalized && normalized !== 'Jeffrey Epstein') {
          participants.add(normalized);
        }
      }
    }

    for (const r of recipients) {
      if (!isJeffrey(r)) {
        const name = cleanName(r);
        if (name) {
          const normalized = normalizeContactName(name);
          if (normalized && normalized !== 'Jeffrey Epstein') {
            participants.add(normalized);
          }
        }
      }
    }
  }

  // Skip if no identifiable non-Jeffrey participant
  if (participants.size === 0) {
    skippedNoContact++;
    continue;
  }

  // Use the first (primary) participant as the contact name
  const primaryContact = Array.from(participants)[0];

  // Filter out spam contacts
  if (!primaryContact) {
    skippedSpam++;
    continue;
  }

  // Process messages for this thread
  const threadMessages = [];
  for (const msg of messages) {
    const sender = msg.sender || '';
    const body = (msg.body || '').trim();

    // Skip empty messages
    if (!body) continue;

    const senderIsJeff = isJeffrey(sender);
    const senderName = senderIsJeff ? 'Jeffrey Epstein' : (cleanName(sender) ? normalizeContactName(cleanName(sender)) : primaryContact);

    const parsedDate = parseTimestamp(msg.timestamp);
    const formattedTime = formatDate(parsedDate);

    threadMessages.push({
      sender: senderName || primaryContact,
      body: body,
      timestamp: parsedDate ? parsedDate.getTime() : 0,
      formattedTime: formattedTime || msg.timestamp || 'Unknown'
    });
  }

  if (threadMessages.length === 0) continue;

  // Add messages to the contact's conversation bucket
  if (!contactConversations[primaryContact]) {
    contactConversations[primaryContact] = [];
  }
  contactConversations[primaryContact].push(...threadMessages);
}

// Step 2: Build final data, sort messages within each conversation, deduplicate
const finalData = [];

for (const [contactName, messages] of Object.entries(contactConversations)) {
  // Sort by timestamp
  messages.sort((a, b) => a.timestamp - b.timestamp);

  // Deduplicate: remove messages with identical sender + normalized body
  const seen = new Set();
  const uniqueMessages = [];
  for (const m of messages) {
    // Normalize body for dedup: collapse whitespace, trim, lowercase first 150 chars
    const normalizedBody = m.body.replace(/\s+/g, ' ').trim().substring(0, 150).toLowerCase();
    const key = `${m.sender}|${normalizedBody}|${m.formattedTime}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueMessages.push({
        sender: m.sender,
        body: m.body,
        formattedTime: m.formattedTime
      });
    }
  }

  if (uniqueMessages.length > 0) {
    finalData.push({
      contactName: contactName,
      messages: uniqueMessages
    });
  }
}

// Step 3: Sort contacts by number of messages (most active first)
finalData.sort((a, b) => b.messages.length - a.messages.length);

// Write output
fs.writeFileSync('d:\\JhatsApp\\jhatsapp\\conversations.json', JSON.stringify(finalData, null, 2));

console.log(`Total threads processed: ${threads.length}`);
console.log(`Skipped (no identifiable contact): ${skippedNoContact}`);
console.log(`Skipped (spam): ${skippedSpam}`);
console.log(`Total conversations: ${finalData.length}`);
console.log(`Top 10 contacts by message count:`);
finalData.slice(0, 10).forEach(c => {
  console.log(`  ${c.contactName}: ${c.messages.length} messages`);
});
