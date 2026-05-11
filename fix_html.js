const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const contactsMatch = html.match(/<script id="contactsData" type="application\/json">([\s\S]*?)<\/script>/);
const convosMatch = html.match(/<script id="convosData" type="application\/json">([\s\S]*?)<\/script>/);

if (contactsMatch && convosMatch) {
  const contactsData = contactsMatch[1];
  const convosData = convosMatch[1];

  // Write data.js
  fs.writeFileSync('data.js', 'window.contactsData = ' + contactsData + ';\nwindow.convosData = ' + convosData + ';\n');

  // Modify HTML
  let newHtml = html.replace(/<script id="contactsData" type="application\/json">[\s\S]*?<\/script>\s*/, '');
  newHtml = newHtml.replace(/<script id="convosData" type="application\/json">[\s\S]*?<\/script>\s*/, '');

  // Add data.js script tag
  newHtml = newHtml.replace('<script src="elon-data.js"></script>', '<script src="data.js"></script>\n<script src="elon-data.js"></script>');

  // Update inline script
  newHtml = newHtml.replace(
    /var contacts = JSON\.parse\(document\.getElementById\('contactsData'\)\.textContent\);\s*var convos = JSON\.parse\(document\.getElementById\('convosData'\)\.textContent\);/,
    'var contacts = window.contactsData;\nvar convos = window.convosData;'
  );

  // Remove dedupeConvos call since it's already done in process_jmail.js and causes Safari hangs
  newHtml = newHtml.replace('convos = dedupeConvos(convos);', '// convos = dedupeConvos(convos);');

  fs.writeFileSync('index.html', newHtml);
  console.log('Success!');
} else {
  console.log('Failed to match script tags.');
}
