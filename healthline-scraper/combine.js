const fs = require('fs');

// 1. Read and parse both files
const file1 = JSON.parse(fs.readFileSync('programs_waterloo.json', 'utf-8')); // e.g., [ {id: 1}, {id: 2} ]
const file2 = JSON.parse(fs.readFileSync('/Users/oliver/projects/moveStrong/goodlife-scraper/goodlife-programs.json', 'utf-8')); // e.g., [ {id: 3} ]

// 2. Combine them using the spread operator (...)
const combinedArray = [...file1, ...file2];

// 3. Save the newly merged array
fs.writeFileSync('combined.json', JSON.stringify(combinedArray, null, 2), 'utf-8');
console.log(`Combined array total elements: ${combinedArray.length}`);