const fs = require('fs');

const content = fs.readFileSync('package.json').toString();
const regexStr = '"version":\\s*"(.*?)"';
const regex = new RegExp(regexStr);
const version = content.match(regex);
console.log(`Found version: ${version[1]}`);
