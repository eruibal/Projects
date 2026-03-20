const fs = require('fs');

const input = fs.readFileSync('Code changes Analysis.csv', 'utf-8');

// Parse CSV manually
const rows = [];
let currentRow = [];
let currentCell = '';
let inQuotes = false;

for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
    } else if (char === '"') {
        inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
        if (char === '\r') i++;
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
    } else {
        currentCell += char;
    }
}
if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
}

// Ensure rows is valid
if (rows.length < 3) {
    console.error("Not enough rows in CSV to extract Title and Summary.");
    process.exit(1);
}

// 1. Title from the first row (first column)
const title = rows[0][0];

// 2. Summary from the next two rows
// The summary items are located in the second column (index 1) of rows 1 and 2
const summaryItem1 = rows[1][1];
const summaryItem2 = rows[2][1];

// 3. The rest is the table
const tableRows = rows.slice(3);

let maxCols = 0;
for (const row of tableRows) {
    if (row.length > maxCols) maxCols = row.length;
}

// Build the Markdown content
let md = `# ${title}\n\n`;
md += `## Summary\n`;
md += `${summaryItem1}\n`;
md += `${summaryItem2}\n\n`;

// Table Headers
const customHeaders = ['Category', 'Section', 'Description'];
let header = [];
for (let i = 0; i < maxCols; i++) {
    header.push(customHeaders[i] || `Column ${i + 1}`);
}
md += '| ' + header.join(' | ') + ' |\n';
md += '|' + Array(maxCols).fill('---').join('|') + '|\n';

// Table Body
for (let i = 0; i < tableRows.length; i++) {
    let row = [...tableRows[i]]; // Create a copy
    while (row.length < maxCols) row.push('');
    // Escape markdown table characters and newlines
    row = row.map(cell => cell.replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|'));
    md += '| ' + row.join(' | ') + ' |\n';
}

fs.writeFileSync('Code changes Analysis.md', md);
console.log('Markdown successfully updated.');
