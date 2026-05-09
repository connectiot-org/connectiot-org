const fs = require('fs');

async function getWikiImage(name) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=200`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null;
    const thumb = pages[pageId].thumbnail;
    if (thumb && thumb.source) {
      return thumb.source;
    }
  } catch (e) {
    console.error(`Error fetching for ${name}:`, e.message);
  }
  return null;
}

async function main() {
  const htmlPath = 'index.html';
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Extract contacts array
  const match = html.match(/const contacts=\[([\s\S]*?)\];/);
  if (!match) {
    console.log("Could not find contacts array");
    return;
  }

  // Use eval to safely get the array (since it's a JS object format, not strict JSON)
  const contactsStr = match[0];
  const contacts = eval(contactsStr.replace('const contacts=', ''));

  console.log(`Found ${contacts.length} contacts.`);

  let updatedCount = 0;
  for (const contact of contacts) {
    console.log(`Processing ${contact.name}...`);
    const wikiImg = await getWikiImage(contact.name);
    if (wikiImg) {
      contact.avatar = wikiImg;
      updatedCount++;
      console.log(`Found image for ${contact.name}: ${wikiImg}`);
    } else {
      // Fallback to UI avatars
      contact.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`;
      console.log(`No wiki image for ${contact.name}, using fallback.`);
    }
    // Delay to not hammer the API
    await new Promise(r => setTimeout(r, 100));
  }

  // Format back into string
  const newContactsStr = 'const contacts=[\n' + contacts.map(c => `  {id:'${c.id}',name:'${c.name.replace(/'/g, "\\'")}',role:'${c.role.replace(/'/g, "\\'")}',avatar:${c.avatar ? `'${c.avatar}'` : 'null'}}`).join(',\n') + '\n];';

  const newHtml = html.replace(match[0], newContactsStr);
  fs.writeFileSync(htmlPath, newHtml, 'utf8');
  console.log(`Updated ${updatedCount} contacts with wiki images, rest with fallbacks. Saved to index.html`);
}

main();
