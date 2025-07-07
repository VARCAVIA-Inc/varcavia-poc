/* eslint no-console: "off" */
/* eslint-env node */
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

/** Path del CSV da normalizzare */
const CSV_PATH = 'dataset_registry.csv';

/** 1. Leggi il file */
const input = fs.readFileSync(CSV_PATH, 'utf8');

/** 2. Effettua il parse accettando righe disallineate */
const records = parse(input, { relax_column_count: true });

/** 3. Trova il numero massimo di colonne */
const maxCols = Math.max(...records.map((row) => row.length));

/** 4. Pad di ogni riga fino a maxCols */
const fixed = records.map((row) => {
  while (row.length < maxCols) row.push('');
  return row;
});

/** 5. Scrivi il CSV normalizzato */
fs.writeFileSync(CSV_PATH, stringify(fixed));

console.log(`✔  ${CSV_PATH} normalizzato a ${maxCols} colonne (righe: ${fixed.length})`);
