import { readFileSync, writeFileSync } from 'fs';

// Read the component data file
const filePath = 'client/src/lib/componentData.ts';
let fileContent = readFileSync(filePath, 'utf8');

// Replace local paths with GitHub URLs for CPUs
const pattern = /image: '\/assets\/images\/cpu\/([a-zA-Z0-9-]+)\.png'/g;
const replacement = "image: 'https://raw.githubusercontent.com/jakeobn/rigfreaks/1a913823e4c1cae6365a2974a963e2541391e442/static/img/cpu/$1.png'";

// Replace all matches
fileContent = fileContent.replace(pattern, replacement);

// Write the updated content back to the file
writeFileSync(filePath, fileContent);

console.log('CPU image paths reverted to GitHub URLs successfully!');
