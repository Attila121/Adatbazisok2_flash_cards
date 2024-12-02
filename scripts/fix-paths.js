const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/index.html');

try {
  let html = fs.readFileSync(indexPath, 'utf-8');
  
  // Replace absolute paths with relative paths
  html = html.replace(/src="\/assets\//g, 'src="./assets/');
  html = html.replace(/href="\/assets\//g, 'href="./assets/');
  
  fs.writeFileSync(indexPath, html);
  console.log('Successfully fixed asset paths in index.html');
} catch (error) {
  console.error('Error fixing paths:', error);
  process.exit(1);
}