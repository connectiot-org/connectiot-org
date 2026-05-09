// Build script: reads conversations.json and injects ALL jmail data
// into the root index.html using the existing premium UI design.
// Contacts are sorted by most messages first.

const fs = require('fs');

// Load processed conversations
const conversations = JSON.parse(
  fs.readFileSync('d:\\JhatsApp\\jhatsapp\\conversations.json', 'utf8')
);

// Sort by message count descending (most active first)
conversations.sort((a, b) => b.messages.length - a.messages.length);

// Build contacts array and convos object
const COLORS = ['#1a5276','#1e8449','#7b241c','#6c3483','#1a5276','#0e6655','#784212','#1f618d'];

const contacts = [];
const convos = {};

for (const conv of conversations) {
  const id = conv.contactName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'unknown-' + Math.random().toString(36).slice(2, 6);

  const uniqueId = contacts.some(c => c.id === id)
    ? id + '-' + Math.random().toString(36).slice(2, 5)
    : id;

  contacts.push({
    id: uniqueId,
    name: conv.contactName,
    role: conv.messages.length + ' messages',
    avatar: null // Will use initials fallback
  });

  // Build msgs array matching the existing format
  const msgs = conv.messages.map((m, i) => {
    const isJeff = m.sender === 'Jeffrey Epstein';
    const time = extractTime(m.formattedTime);
    const date = extractDate(m.formattedTime);
    return {
      id: i,
      from: isJeff ? 'me' : 'them',
      text: m.body,
      time: time,
      date: date
    };
  });

  const lastMsg = msgs[msgs.length - 1];
  const lastWithText = [...msgs].reverse().find(m => (m.text || '').trim());
  const preview = lastWithText ? lastWithText.text.substring(0, 60) : '';

  convos[uniqueId] = {
    last: lastMsg ? formatShortDate(lastMsg.date) : '',
    preview: preview,
    msgs: msgs
  };
}

function extractTime(formattedTime) {
  if (!formattedTime || formattedTime === 'Unknown') return '';
  // "2019-05-30 17:29" -> "5:29 PM"
  const d = new Date(formattedTime.replace(' ', 'T'));
  if (isNaN(d.getTime())) return '';
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min} ${ampm}`;
}

function extractDate(formattedTime) {
  if (!formattedTime || formattedTime === 'Unknown') return '';
  const d = new Date(formattedTime.replace(' ', 'T'));
  if (isNaN(d.getTime())) return '';
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

// Read the existing index.html to get the CSS/structure
const existingHtml = fs.readFileSync('d:\\JhatsApp\\index.html', 'utf8');

// Extract the CSS from existing file (lines 8 to 139 roughly)
const styleMatch = existingHtml.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : '';

// Generate a complete self-contained HTML file
const contactsJson = JSON.stringify(contacts);
const convosJson = JSON.stringify(convos);

const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>JhatsApp</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
${css}
.msg-count-badge{
  font-size:10px;color:var(--t3);background:rgba(142,142,147,0.12);
  padding:2px 7px;border-radius:99px;margin-left:6px;flex-shrink:0;
}
.stats-bar{
  padding:8px 16px;font-size:12px;color:var(--t3);
  border-bottom:1px solid var(--br);background:rgba(255,255,255,0.5);
  backdrop-filter:blur(10px);display:flex;align-items:center;gap:6px;
}
.stats-bar span{font-weight:600;color:var(--g)}
</style>
</head>
<body>
<div class="app">
  <aside class="sidebar" id="sidebar">
    <div class="s-head">
      <span class="logo-icon">💬</span>
      <div>
        <div class="logo-name">JhatsApp</div>
        <div class="logo-sub">by Jmail</div>
      </div>
    </div>
    <div class="s-search">
      <span style="opacity:.5">🔍</span>
      <input id="search" type="text" placeholder="Search conversations…" oninput="renderList()"/>
    </div>
    <div class="stats-bar">
      <span>${conversations.length}</span> conversations •
      <span>${totalMessages.toLocaleString()}</span> messages
    </div>
    <div class="s-list" id="list"></div>
  </aside>
  <main class="main" id="main">
    <div class="empty" id="empty">
      <div class="empty-icon">💬</div>
      <h2>JhatsApp</h2>
      <p>Select a conversation to start reading</p>
    </div>
    <div id="chat" style="display:none;flex:1;flex-direction:column;overflow:hidden"></div>
  </main>
</div>
<script id="contactsData" type="application/json">
${contactsJson}
</script>
<script id="convosData" type="application/json">
${convosJson}
</script>
<script>
var contacts = JSON.parse(document.getElementById('contactsData').textContent);
var convos = JSON.parse(document.getElementById('convosData').textContent);

var COLORS=['#1a5276','#1e8449','#7b241c','#6c3483','#1a5276','#0e6655','#784212','#1f618d'];
function colorFn(n){ return COLORS[n.charCodeAt(0) % COLORS.length]; }
function initials(n){
  return n.replace(/Maybe:\\s*/i,'').split(' ').filter(function(_,i){return i<2;}).map(function(w){return w[0]||'';}).join('').toUpperCase();
}

var activeId = null;

function avHtml(c, size) {
  size = size || 46;
  var s = 'width:'+size+'px;height:'+size+'px';
  return '<div class="av-f" style="'+s+';background:'+colorFn(c.name)+'">'+initials(c.name)+'</div>';
}

function esc(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

function renderList() {
  var q = document.getElementById('search').value.toLowerCase();
  var filtered = contacts.filter(function(c){ return c.name.toLowerCase().indexOf(q) !== -1; });
  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var c = filtered[i];
    var cv = convos[c.id];
    if (!cv) continue;
    var prev = esc((cv.preview || '').substring(0, 50));
    html += '<div class="s-item'+(activeId===c.id?' active':'')+'" style="--i:'+Math.min(i,20)+'" onclick="openChat(\\''+c.id+'\\')">' +
      '<div style="display:flex;flex-shrink:0">'+avHtml(c)+'</div>' +
      '<div class="s-info">' +
        '<div class="s-row"><span class="s-name">'+esc(c.name)+'</span><span class="msg-count-badge">'+cv.msgs.length+'</span><span class="s-date">'+cv.last+'</span></div>' +
        '<div class="s-prev">'+prev+'</div>' +
      '</div>' +
    '</div>';
  }
  document.getElementById('list').innerHTML = html;
}

function openChat(id) {
  activeId = id;
  renderList();
  var c = contacts.find(function(x){ return x.id === id; });
  var cv = convos[id];
  if (!c || !cv) return;

  document.getElementById('empty').style.display = 'none';
  var chat = document.getElementById('chat');
  chat.style.display = 'flex';
  chat.style.flexDirection = 'column';
  chat.style.overflow = 'hidden';
  chat.style.flex = '1';

  var lastDate = '';
  var msgsHtml = '';
  for (var i = 0; i < cv.msgs.length; i++) {
    var m = cv.msgs[i];
    var sep = '';
    if (m.date && m.date !== lastDate) {
      lastDate = m.date;
      sep = '<div class="date-sep"><span>'+m.date+'</span></div>';
    }
    var bubbleClass = m.from === 'me' ? 'b-me' : 'b-them';
    var bodyText = esc(m.text || '');
    msgsHtml += sep + '<div class="bubble '+bubbleClass+'" style="--i:'+Math.min(i,30)+'">'+bodyText+'<div class="b-time">'+m.time+(m.from==='me'?' ✓✓':'')+'</div></div>';
  }

  chat.innerHTML =
    '<div class="c-head">' +
      '<button class="back-btn" id="back-btn" onclick="goBack()" aria-label="Back to contacts">&#8592;</button>' +
      '<div style="display:flex;flex-shrink:0">'+avHtml(c,40)+'</div>' +
      '<div class="c-head-info"><div class="c-name">'+esc(c.name)+'</div><div class="c-role">'+cv.msgs.length+' messages</div></div>' +
    '</div>' +
    '<div class="c-msgs" id="msgs">'+msgsHtml+'</div>';

  var el = document.getElementById('msgs');
  el.scrollTop = el.scrollHeight;

  if (window.innerWidth <= 700) {
    document.getElementById('sidebar').classList.add('hidden');
  }
}

function goBack() {
  document.getElementById('sidebar').classList.remove('hidden');
  var chat = document.getElementById('chat');
  if (window.innerWidth <= 700) {
    chat.style.display = 'none';
    document.getElementById('empty').style.display = 'flex';
    activeId = null;
    renderList();
  }
}

window.addEventListener('resize', function() {
  if (window.innerWidth > 700) {
    document.getElementById('sidebar').classList.remove('hidden');
  }
});

renderList();
</script>
</body>
</html>`;

fs.writeFileSync('d:\\JhatsApp\\index.html', html, 'utf8');

console.log('Generated d:\\JhatsApp\\index.html');
console.log('Conversations:', conversations.length);
console.log('Total messages:', totalMessages);
console.log('File size:', (html.length / 1024 / 1024).toFixed(2), 'MB');
console.log('Top 10 contacts:');
conversations.slice(0, 10).forEach(c => {
  console.log('  ' + c.contactName + ': ' + c.messages.length + ' messages');
});
