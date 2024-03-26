const fs = require('fs');

const content = fs.readFileSync('package.json').toString();
const regexStr = '"version":\\s*"(.*?)"';
const regex = new RegExp(regexStr, 'g');
const version = content.match(regex);
console.log(`Found version: ${version}`);
