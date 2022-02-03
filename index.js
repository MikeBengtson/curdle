const fs = require('fs');
const prompt = require('prompt-sync')();

const terminalGreen = '\x1b[32m%s\x1b[0m';
const terminalYellow = '\x1b[33m%s\x1b[0m';

let filename = './powerlanguage-words.txt'
if (process.argv.length > 2) {
    filename = process.argv.splice(2); 
}

const getWordList = (filename) =>
   fs.readFileSync(filename)
   .toString('UTF8')
   .split('\n');

const wordlist = getWordList(filename);
   
console.log(`Loaded ${filename} with ${wordlist.length} words\n`);

const exclusions = prompt('What letters do you know are NOT in the word AT ALL?: ').toLowerCase();

console.log(terminalGreen, "\nFrom left to right, positions 1-5, what letters do you KNOW for each position? (Enter for 'none' in position)");
const knownRightPlaces = [];
for (let i = 0; i < 5; i++) {
    knownRightPlaces[i] = prompt(`position ${i+1}: `).toLowerCase();
}

console.log(terminalYellow, "\nWhat letters do you know DO NOT belong in each position? (Enter for 'none' in position)");
const knownWrongPlaces = [];
for (let i = 0; i < 5; i++) {
    knownWrongPlaces[i] = prompt(`position ${i+1}: `).toLowerCase(); 
}

const regexgroups = [];
for (let i = 0; i < 5; i++) {
    if (knownRightPlaces[i]) {
        regexgroups.push(knownRightPlaces[i]);
    } else {
        regexgroups.push("[^" + exclusions + knownWrongPlaces[i] + "]"); 
    }
}

const regex = "^" + regexgroups.join("");

console.log(`\nRegex is: ${regex}\n`)

const possibles = wordlist.filter((word) => word.match(regex) != null);
console.log(`There are ${possibles.length} possibilities:\n`);
possibles.forEach(element => console.log(element));

console.log('\n');