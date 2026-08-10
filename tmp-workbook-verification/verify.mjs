import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const workbookPath = fileURLToPath(new URL('../QA_Interview_Bible_7_8_Years.xlsx', import.meta.url));
const outputDir = fileURLToPath(new URL('./rendered/', import.meta.url));
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const sheets = workbook.worksheets.items;
const targetSheets = [
  'Selenium Browser Handling',
  'Advanced SQL',
  'QA Strategy Metrics',
  'Top 50 Senior QA',
  'Top 200 Must-Know'
];

const checks = {};
for (const sheetName of targetSheets) {
  const inspection = await workbook.inspect({
    kind: 'table',
    range: `${sheetName}!A1:Y6`,
    include: 'values,formulas',
    tableMaxRows: 6,
    tableMaxCols: 25,
    tableMaxCellChars: 80
  });
  checks[sheetName] = inspection.ndjson;
}

const errors = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 100 },
  summary: 'formula error scan'
});

await fs.mkdir(outputDir, { recursive: true });
for (const sheetName of targetSheets) {
  const preview = await workbook.render({ sheetName, range: 'A1:Y6', scale: 1.25, format: 'png' });
  await fs.writeFile(`${outputDir}/${sheetName.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.png`, new Uint8Array(await preview.arrayBuffer()));
}

console.log(JSON.stringify({
  sheetCount: sheets.length,
  inspected: Object.fromEntries(Object.entries(checks).map(([name, value]) => [name, value.includes('"rows":[]') ? 0 : 1])),
  formulaErrors: errors.ndjson,
  renderedSheets: targetSheets.length
}, null, 2));
