// optimize.js - Fixes Safari crash & shrinks index.html
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');

// 1. Extract contacts JSON
const contactsMatch = html.match(/<script id="contactsData" type="application\/json">([\s\S]*?)<\/script>/);
if (!contactsMatch) { console.error('No contacts found'); process.exit(1); }
const contacts = JSON.parse(contactsMatch[1]);

// 2. Filter: keep only contacts with >= 5 messages
const filtered = contacts.filter(c => {
  const m = String(c.role || '').match(/\d+/);
  return m && parseInt(m[0], 10) >= 5;
});
console.log(`Contacts: ${contacts.length} -> ${filtered.length}`);

// 3. Read elon-data.js and extract the data
let elonData = null;
try {
  const elonJs = fs.readFileSync('elon-data.js', 'utf-8');
  // Execute it to get the data
  const fn = new Function(elonJs + '; return window.__elonData;');
  // Simpler: just extract the JSON object
  const elonMatch = elonJs.match(/window\.__elonData\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (elonMatch) {
    elonData = JSON.parse(elonMatch[1]);
  }
} catch(e) { console.warn('Could not parse elon-data.js:', e.message); }

// 4. If elon contact exists in data, ensure it's in filtered list
if (elonData && elonData.contact) {
  const exists = filtered.find(c => c.id === elonData.contact.id);
  if (!exists) {
    filtered.unshift(elonData.contact);
  }
}

// 5. Compact JSON (no pretty-print)
const compactContacts = JSON.stringify(filtered);

// 6. Build the elon inline script
let elonInlineScript = '';
if (elonData) {
  elonInlineScript = `<script>window.__elonData=${JSON.stringify(elonData)};</script>`;
}

// 7. Extract CSS (between <style> and </style>)
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const css = cssMatch ? cssMatch[1] : '';

// 8. Extract JS (the main app script after convosIndex)
const jsMatch = html.match(/<script>\s*var contacts = JSON\.parse[\s\S]*?<\/script>\s*<\/body>/);

// 9. Build optimized HTML
const optimizedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="default"/>
<title>JhatsApp</title>
<meta name="description" content="JhatsApp - A sleek iOS-style messaging web app with responsive design for desktop and mobile.">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
${css}
/* Safari fix: disable heavy animations on mobile */
@media(max-width:700px){
  .s-item,.bubble{animation:none !important;}
}
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
      <span id="statsConvos">0</span> conversations •
      <span id="statsMessages">0</span> messages
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
<script id="contactsData" type="application/json">${compactContacts}</script>
<script id="convosIndex" type="application/json">{}</script>
${elonInlineScript}
<script>
try {
var contacts = JSON.parse(document.getElementById('contactsData').textContent);
} catch(e) { var contacts = []; console.error('Failed to parse contacts', e); }

var convosIndex = {};
var convosCache = {};
var convosIndexLoaded = false;
var convosIndexPromise = null;

try {
  var convosIndexEl = document.getElementById('convosIndex');
  if (convosIndexEl && convosIndexEl.textContent.trim()) {
    convosIndex = JSON.parse(convosIndexEl.textContent);
    convosIndexLoaded = Object.keys(convosIndex).length > 0;
  }
} catch(e) { convosIndex = {}; }

function normalizeBody(text) {
  return String(text || '').replace(/\\s+/g, ' ').trim();
}

function parseRoleCount(role) {
  var match = String(role || '').match(/\\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function messageKey(msg) {
  return [
    msg && msg.from ? msg.from : '',
    msg && msg.time ? msg.time : '',
    msg && msg.date ? msg.date : '',
    normalizeBody(msg && msg.text ? msg.text : '')
  ].join('|');
}

function dedupeMessages(list) {
  var seen = Object.create(null);
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var msg = list[i];
    var key = messageKey(msg);
    if (seen[key]) continue;
    seen[key] = true;
    out.push(msg);
  }
  return out;
}

var pinnedIds = ['elon-musk', 'bill-gates'];
var pinnedOrder = {};
for (var i = 0; i < pinnedIds.length; i++) {
  pinnedOrder[pinnedIds[i]] = i;
}

var contactOrder = {};
function buildContactOrder() {
  contactOrder = {};
  for (var i = 0; i < contacts.length; i++) {
    contactOrder[contacts[i].id] = i;
  }
}

function upsertContact(contact) {
  if (!contact || !contact.id) return;
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].id === contact.id) {
      Object.assign(contacts[i], contact);
      return;
    }
  }
  contacts.push(contact);
}

function upsertConversation(id, conv) {
  if (!id || !conv) return;
  var base = convosCache[id] || { msgs: [] };
  var next = Object.assign({}, base, conv);
  if (Array.isArray(next.msgs)) {
    next.msgs = dedupeMessages(next.msgs);
  }
  convosCache[id] = next;
  var currentMeta = convosIndex[id] || {};
  var preview = next.preview;
  if (!preview && Array.isArray(next.msgs) && next.msgs.length) {
    preview = next.msgs[next.msgs.length - 1].text || '';
  }
  convosIndex[id] = Object.assign({}, currentMeta, {
    last: next.last || currentMeta.last || '',
    preview: preview || currentMeta.preview || '',
    count: Array.isArray(next.msgs) ? next.msgs.length : 0
  });
}

function applyContactOverrides(overrides) {
  var keys = Object.keys(overrides || {});
  for (var i = 0; i < keys.length; i++) {
    var id = keys[i];
    upsertContact(Object.assign({ id: id }, overrides[id]));
  }
}

function loadConvosIndex() {
  if (convosIndexPromise) return convosIndexPromise;
  convosIndexPromise = fetch('data/convos-index.json', { cache: 'force-cache' })
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load conversation index');
      return res.json();
    })
    .then(function(data) {
      convosIndex = data || {};
      convosIndexLoaded = true;
      updateStats();
      renderList();
      return convosIndex;
    })
    .catch(function(err) {
      console.warn('Unable to load conversation index', err);
      return convosIndex;
    });
  return convosIndexPromise;
}

function loadConversation(id) {
  if (convosCache[id]) return Promise.resolve(convosCache[id]);
  return loadConvosIndex().then(function() {
    var meta = convosIndex[id];
    if (!meta || !meta.file) {
      throw new Error('Missing conversation file for ' + id);
    }
    return fetch('data/convos/' + meta.file)
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load conversation');
        return res.json();
      })
      .then(function(conv) {
        conv.msgs = Array.isArray(conv.msgs) ? dedupeMessages(conv.msgs) : [];
        convosCache[id] = conv;
        return conv;
      });
  });
}

function sortContacts(a, b) {
  var aPinned = pinnedOrder.hasOwnProperty(a.id);
  var bPinned = pinnedOrder.hasOwnProperty(b.id);
  if (aPinned && bPinned) return pinnedOrder[a.id] - pinnedOrder[b.id];
  if (aPinned) return -1;
  if (bPinned) return 1;
  var aIndex = contactOrder[a.id];
  var bIndex = contactOrder[b.id];
  if (aIndex == null) aIndex = Number.MAX_SAFE_INTEGER;
  if (bIndex == null) bIndex = Number.MAX_SAFE_INTEGER;
  return aIndex - bIndex;
}

if (window.__elonData && window.__elonData.contact) {
  upsertContact(window.__elonData.contact);
  if (window.__elonData.conversation) {
    upsertConversation(window.__elonData.contact.id, window.__elonData.conversation);
  }
}

applyContactOverrides({
  'elon-musk': {
    name: 'Elon Musk',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhOjm1S6UfcX3hhCqpOvOIaBmoC2iiR-MbwdbocpBfuS9u--zmg_jSD9NgnlmO9JCRISRyG6PLTTRsquZ_KnwKASuhWEJRXlyvhzdsSG0&s=10'
  },
  'bill-gates': {
    name: 'Bill Gates',
    avatar: 'https://jmail.world/_next/image?url=%2Fpeople-thumbnails%2Fbill-gates.png&w=256&q=75'
  }
});

buildContactOrder();

function updateStats() {
  var keys = Object.keys(convosIndex || {});
  var totalMessages = 0;
  if (keys.length) {
    for (var i = 0; i < keys.length; i++) {
      var meta = convosIndex[keys[i]];
      totalMessages += meta && typeof meta.count === 'number' ? meta.count : 0;
    }
  } else {
    for (var j = 0; j < contacts.length; j++) {
      totalMessages += parseRoleCount(contacts[j].role);
    }
  }
  var convosEl = document.getElementById('statsConvos');
  var messagesEl = document.getElementById('statsMessages');
  var convoCount = keys.length || contacts.length;
  if (convosEl) convosEl.textContent = convoCount.toLocaleString();
  if (messagesEl) messagesEl.textContent = totalMessages.toLocaleString();
}

var COLORS=['#1a5276','#1e8449','#7b241c','#6c3483','#1a5276','#0e6655','#784212','#1f618d'];
function colorFn(n){ return COLORS[n.charCodeAt(0) % COLORS.length]; }
function initials(n){
  return n.replace(/Maybe:\\s*/i,'').split(' ').filter(function(_,i){return i<2;}).map(function(w){return w[0]||'';}).join('').toUpperCase();
}

function esc(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

var activeId = null;
var MAX_RENDER_MESSAGES = 200;
var MAX_RENDER_CONTACTS = 100;

function avHtml(c, size) {
  size = size || 46;
  var s = 'width:'+size+'px;height:'+size+'px';
  if (c.avatar) {
    return '<img class="av" src="'+esc(c.avatar)+'" alt="'+esc(c.name)+'" style="'+s+'" loading="lazy">';
  }
  return '<div class="av-f" style="'+s+';background:'+colorFn(c.name)+'">'+initials(c.name)+'</div>';
}

function renderList() {
  var q = document.getElementById('search').value.toLowerCase();
  var filtered = contacts.filter(function(c){ return c.name.toLowerCase().indexOf(q) !== -1; });
  filtered.sort(sortContacts);
  // Limit rendered contacts for performance
  var renderCount = Math.min(filtered.length, MAX_RENDER_CONTACTS);
  var html = '';
  for (var i = 0; i < renderCount; i++) {
    var c = filtered[i];
    var meta = convosIndex[c.id];
    var msgCount = meta && typeof meta.count === 'number' ? meta.count : parseRoleCount(c.role);
    var prevRaw = meta && meta.preview ? meta.preview : '';
    prevRaw = normalizeBody(prevRaw);
    if (!prevRaw) prevRaw = msgCount ? 'Tap to load messages' : 'No messages yet';
    var prev = esc(prevRaw.substring(0, 50));
    var lastDate = meta && meta.last ? meta.last : '';
    html += '<div class="s-item'+(activeId===c.id?' active':'')+'" onclick="openChat(\\''+c.id+'\\')">'+
      '<div style="display:flex;flex-shrink:0">'+avHtml(c)+'</div>'+
      '<div class="s-info">'+
        '<div class="s-row"><span class="s-name">'+esc(c.name)+'</span><span class="msg-count-badge">'+msgCount+'</span><span class="s-date">'+esc(lastDate)+'</span></div>'+
        '<div class="s-prev">'+prev+'</div>'+
      '</div>'+
    '</div>';
  }
  if (filtered.length > renderCount) {
    html += '<div style="text-align:center;padding:12px;color:var(--t3);font-size:13px">Search to find more contacts ('+filtered.length+' total)</div>';
  }
  document.getElementById('list').innerHTML = html;
}

function openChat(id) {
  activeId = id;
  renderList();
  var c = contacts.find(function(x){ return x.id === id; });
  if (!c) return;

  document.getElementById('empty').style.display = 'none';
  var chat = document.getElementById('chat');
  chat.style.display = 'flex';
  chat.style.flexDirection = 'column';
  chat.style.overflow = 'hidden';
  chat.style.flex = '1';

  var headerHtml =
    '<div class="c-head">'+
      '<button class="back-btn" id="back-btn" onclick="goBack()" aria-label="Back to contacts">&#8592;</button>'+
      '<div style="display:flex;flex-shrink:0">'+avHtml(c,40)+'</div>'+
      '<div class="c-head-info"><div class="c-name">'+esc(c.name)+'</div><div class="c-role">Loading…</div></div>'+
    '</div>';

  chat.innerHTML = headerHtml +
    '<div class="empty" style="flex:1">'+
      '<div class="empty-icon">💬</div>'+
      '<h2>Loading messages…</h2>'+
      '<p>This can take a moment on first open.</p>'+
    '</div>';

  loadConversation(id)
    .then(function(cv) {
      var msgs = Array.isArray(cv.msgs) ? cv.msgs : [];
      var totalCount = msgs.length;
      var renderMsgs = msgs;
      var trimmed = false;
      if (msgs.length > MAX_RENDER_MESSAGES) {
        renderMsgs = msgs.slice(msgs.length - MAX_RENDER_MESSAGES);
        trimmed = true;
      }

      var nextHeader =
        '<div class="c-head">'+
          '<button class="back-btn" id="back-btn" onclick="goBack()" aria-label="Back to contacts">&#8592;</button>'+
          '<div style="display:flex;flex-shrink:0">'+avHtml(c,40)+'</div>'+
          '<div class="c-head-info"><div class="c-name">'+esc(c.name)+'</div><div class="c-role">'+totalCount+' messages</div></div>'+
        '</div>';

      if (!msgs.length) {
        chat.innerHTML = nextHeader +
          '<div class="empty" style="flex:1">'+
            '<div class="empty-icon">💬</div>'+
            '<h2>No messages yet</h2>'+
            '<p>This conversation does not have any messages.</p>'+
          '</div>';
        if (window.innerWidth <= 700) {
          document.getElementById('sidebar').classList.add('hidden');
        }
        return;
      }

      var lastDate = '';
      var msgsHtml = '';
      if (trimmed) {
        msgsHtml += '<div class="date-sep"><span>Showing last '+renderMsgs.length+' of '+totalCount+'</span></div>';
      }
      for (var i = 0; i < renderMsgs.length; i++) {
        var m = renderMsgs[i];
        var sep = '';
        if (m.date && m.date !== lastDate) {
          lastDate = m.date;
          sep = '<div class="date-sep"><span>'+m.date+'</span></div>';
        }
        var bubbleClass = m.from === 'me' ? 'b-me' : 'b-them';
        var bodyText = esc(m.text || '').replace(/\\r?\\n/g, '<br>');
        var timeLabel = m.time ? esc(m.time) : '';
        var timeSuffix = (m.from === 'me' && timeLabel) ? ' ✓✓' : '';
        var timeHtml = timeLabel ? '<div class="b-time">'+timeLabel+timeSuffix+'</div>' : '';
        msgsHtml += sep + '<div class="bubble '+bubbleClass+'">'+bodyText+timeHtml+'</div>';
      }

      chat.innerHTML = nextHeader + '<div class="c-msgs" id="msgs">'+msgsHtml+'</div>';
      var el = document.getElementById('msgs');
      el.scrollTop = el.scrollHeight;

      if (window.innerWidth <= 700) {
        document.getElementById('sidebar').classList.add('hidden');
      }
    })
    .catch(function(err) {
      console.warn('Failed to load conversation', err);
      chat.innerHTML = headerHtml +
        '<div class="empty" style="flex:1">'+
          '<div class="empty-icon">💬</div>'+
          '<h2>Unable to load messages</h2>'+
          '<p>Please refresh or try again.</p>'+
        '</div>';
      if (window.innerWidth <= 700) {
        document.getElementById('sidebar').classList.add('hidden');
      }
    });
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

updateStats();
renderList();
loadConvosIndex();
</script>
</body>
</html>`;

fs.writeFileSync('index_optimized.html', optimizedHtml, 'utf-8');

const origSize = Buffer.byteLength(html, 'utf-8');
const newSize = Buffer.byteLength(optimizedHtml, 'utf-8');
console.log(`Original: ${(origSize/1024).toFixed(1)} KB`);
console.log(`Optimized: ${(newSize/1024).toFixed(1)} KB`);
console.log(`Reduction: ${((1 - newSize/origSize) * 100).toFixed(1)}%`);
