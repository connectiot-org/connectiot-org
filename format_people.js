const fs = require('fs');
const allData = JSON.parse(fs.readFileSync('people_messages.json', 'utf8'));

const avatars = {
  "bill-gates": "https://jmail.world/_next/image?url=%2Fpeople-thumbnails%2Fbill-gates.png&w=256&q=75",
  "reid-hoffman": "https://jmail.world/_next/image?url=%2Fpeople-thumbnails%2Freid-hoffman.png&w=256&q=75",
  "woody-allen": "https://jmail.world/_next/image?url=%2Fpeople-thumbnails%2Fwoody-allen.png&w=256&q=75"
};

const names = {
  "bill-gates": "Bill Gates",
  "reid-hoffman": "Reid Hoffman",
  "woody-allen": "Woody Allen"
};

const roles = {
  "bill-gates": "Co-founder of Microsoft",
  "reid-hoffman": "Co-founder of LinkedIn",
  "woody-allen": "Filmmaker and actor"
};

let contactsStr = "";
let conversationsStr = "";
let pinnedStr = [];

for (const [slug, messages] of Object.entries(allData)) {
  contactsStr += `  { id: "${slug}", name: "${names[slug]}", role: "${roles[slug]}", avatar: "${avatars[slug]}" },\n`;
  pinnedStr.push(`"${slug}"`);
  
  const lastMessage = messages[messages.length - 1];
  let lastDate = "";
  if (lastMessage) {
    const d = new Date(lastMessage.original_date);
    lastDate = `${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}/${d.getFullYear().toString().slice(2)}`;
  }

  // Remove original_date from messages before stringifying
  const cleanMessages = messages.map(m => {
    const { original_date, ...rest } = m;
    return rest;
  });

  conversationsStr += `
  "${slug}": {
    contactId: "${slug}",
    lastDate: "${lastDate}",
    lastMessage: ${JSON.stringify(lastMessage ? lastMessage.text : "")},
    messages: ${JSON.stringify(cleanMessages, null, 6).replace(/\\n/g, "\\n").replace(/"([^"]+)":/g, "$1:")}
  },
`;
}

console.log("--- CONTACTS ---");
console.log(contactsStr);
console.log("--- CONVERSATIONS ---");
console.log(conversationsStr);
fs.writeFileSync('format_people.txt', contactsStr + '\n======\n' + pinnedStr.join(', ') + '\n======\n' + conversationsStr);
