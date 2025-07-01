// packages/scripts/update_registry.ts

import fs from "fs";
import path from "path";

// Prendi i dati da variabili d'ambiente o da prompt manuale (per ora facciamo input veloce)
const DATASET_NAME = process.env.DATASET_NAME || "Open Food Facts sample";
const CID = process.env.CID || "<il-tuo-CID>";
const NFT_CONTRACT = process.env.NFT_CONTRACT || "<address-NFT>";
const TOKEN_ID = process.env.TOKEN_ID || "0";
const OWNER = process.env.OWNER || "<tuo-wallet>";

const REGISTRY_PATH = path.resolve(__dirname, "../../dataset_registry.csv");

// Crea header se non esiste
if (!fs.existsSync(REGISTRY_PATH)) {
  fs.writeFileSync(REGISTRY_PATH, "Dataset Name,CID (Lighthouse),NFT Contract Address,Token ID,Owner Wallet Address\n");
}

// Aggiungi la riga (evita duplicati!)
const newRow = [DATASET_NAME, CID, NFT_CONTRACT, TOKEN_ID, OWNER].join(",") + "\n";
const csv = fs.readFileSync(REGISTRY_PATH, "utf-8");
if (!csv.includes(newRow.trim())) {
  fs.appendFileSync(REGISTRY_PATH, newRow);
  console.log("✅ Aggiunto nuovo dataset al registro:", newRow);
} else {
  console.log("ℹ️  Il dataset è già presente.");
}
