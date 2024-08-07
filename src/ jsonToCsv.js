// jsonToCsv.js
import { Parser } from 'json2csv';
import fs from 'fs';

export function saveJsonToCsv(jsonArray, csvFilePath) {
  try {
    const parser = new Parser();
    const csv = parser.parse(jsonArray);

    fs.writeFileSync(csvFilePath, csv);
    console.log(`CSV file saved to ${csvFilePath}`);
  } catch (err) {
    console.error('Error converting JSON to CSV:', err);
  }
}
 
