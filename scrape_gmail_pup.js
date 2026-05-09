const puppeteer = require('puppeteer');
const fs = require('fs');

async function searchGmail() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('https://jmail.world/search?q=gmail.com', { waitUntil: 'networkidle0' });
  
  // Extract all links that go to threads
  const threads = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/thread/"]'));
    return links.map(a => a.href).filter((v, i, a) => a.indexOf(v) === i); // unique
  });
  
  console.log('Found threads:', threads.length);
  fs.writeFileSync('gmail_threads.json', JSON.stringify(threads, null, 2));
  
  await browser.close();
}

searchGmail();
