import { readFileSync, writeFileSync } from 'fs';

// Read the component data file
const filePath = 'client/src/lib/componentData.ts';
let fileContent = readFileSync(filePath, 'utf8');

// Use a regular expression to find and replace all GitHub image URLs for motherboards
const pattern = /image: 'https:\/\/raw\.githubusercontent\.com\/jakeobn\/rigfreaks\/[a-zA-Z0-9]+\/static\/img\/motherboard\/([a-zA-Z0-9-]+)\.png'/g;
const replacement = "image: '/assets/images/motherboard/$1.png'";

// Replace all matches
fileContent = fileContent.replace(pattern, replacement);

// Write the updated content back to the file
writeFileSync(filePath, fileContent);

console.log('Motherboard image paths updated successfully!');
