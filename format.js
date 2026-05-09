const fs = require('fs');
const threads = JSON.parse(fs.readFileSync('threads.json', 'utf8'));

// We want to sort threads chronologically (oldest to newest)
threads.sort((a, b) => new Date(a.formatted_date) - new Date(b.formatted_date));

const messages = [];
let idCounter = 1;

for (const t of threads) {
  // If sender is Elon Musk, it's from "them"
  // If sender is jeffrey E / Epstein, it's from "me"
  let from = "them";
  const name = (t.sender_name || "").toLowerCase();
  const email = (t.sender_email || "").toLowerCase();
  
  if (name.includes("elon") || email.includes("elon")) {
    from = "them";
  } else if (name.includes("jeffrey") || email.includes("jeffrey") || name.includes("epstein") || email.includes("epstein") || email.includes("jeevacation")) {
    from = "me";
  } else {
    // some defaults based on previews
    if (t.preview.toLowerCase().includes("organize elon") || t.preview.toLowerCase().includes("i will send heli")) {
      from = "me";
    }
  }

  // format date: "Sat, Jul 6, 2019"
  const dateObj = new Date(t.formatted_date);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const formattedDate = `${days[dateObj.getDay()]}, ${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
  
  messages.push({
    id: idCounter++,
    from: from,
    text: t.preview,
    time: "12:00 PM", // Mocked time as API only has date in preview list
    date: formattedDate
  });
}

// Generate the contact and conversation object
const contact = `
  { id: "elon-musk",           name: "Elon Musk",            role: "CEO of Tesla & SpaceX",                                      avatar: "https://image.cnbcfm.com/api/v1/image/107293744-1693398435735-elon.jpg?v=1738327797" },
`;

const lastMessage = messages[messages.length - 1];
let lastDate = "";
if (lastMessage) {
  const d = new Date(lastMessage.date);
  // MM/DD/YY
  lastDate = `${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}/${d.getFullYear().toString().slice(2)}`;
}

const conversation = `
  "elon-musk": {
    contactId: "elon-musk",
    lastDate: "${lastDate}",
    lastMessage: ${JSON.stringify(lastMessage ? lastMessage.text : "")},
    messages: ${JSON.stringify(messages, null, 6).replace(/\\n/g, "\\n").replace(/"([^"]+)":/g, "$1:")}
  },
`;

console.log("--- CONTACT TO ADD ---");
console.log(contact);
console.log("--- CONVERSATION TO ADD ---");
console.log(conversation);
fs.writeFileSync('output.txt', conversation);
