const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function getGoogleFontUrl(family, weight) {
  return new Promise((resolve, reject) => {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
    https.get(cssUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const match = body.match(/src:\s*url\((https:\/\/[^)]+)\)/);
        if (match) {
          resolve(match[1]);
        } else {
          reject(new Error('Font url not found in CSS for ' + family + ' ' + weight));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading fonts...');
  const jakartaUrl = await getGoogleFontUrl('Plus Jakarta Sans', 800);
  console.log('Plus Jakarta Sans 800:', jakartaUrl);
  await downloadFile(jakartaUrl, path.join(fontsDir, 'PlusJakartaSans-ExtraBold.ttf'));

  const jakartaSemiBoldUrl = await getGoogleFontUrl('Plus Jakarta Sans', 700);
  console.log('Plus Jakarta Sans 700:', jakartaSemiBoldUrl);
  await downloadFile(jakartaSemiBoldUrl, path.join(fontsDir, 'PlusJakartaSans-Bold.ttf'));

  console.log('Fonts downloaded successfully!');
}

main().catch(console.error);
