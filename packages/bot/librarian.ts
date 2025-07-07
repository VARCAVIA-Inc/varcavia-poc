/**
 * Librarian-Bot v0.3-b
 * -------------------------------------------------------------
 * 1. Scarica dataset (URL indicati in packages/bot/seed.txt)
 * 2. Carica su Lighthouse ➜ ottiene CID
 * 3. Mint NFT su thirdweb (Sepolia):
 *      • se il contratto è “NFT Collection” → erc721.mintTo
 *      • se è “NFT Drop”        → lazyMint + claimTo
 * 4. Aggiorna dataset_registry.csv
 * 5. Inserisce record in Qdrant (crea collection se manca)
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Wallet } from "ethers";
import { QdrantClient } from "@qdrant/js-client-rest";

/* ======= ENV ======= */
const {
  LH_API_KEY,                       // ⇒ secret LH_API_KEY
  PKEY_TESTNET,                     // testnet wallet (sepolia)
  LUMIGO_PRIVATE_KEY,               // mainnet wallet (polygon/eth)
  DATASET_NFT_CONTRACT: NFT_CONTRACT,
  THIRDWEB_CLIENT_ID:  TW_CLIENT_ID,
  THIRDWEB_SECRET_KEY: TW_SECRET_KEY,
  QDRANT_URL:   Q_URL,
  QDRANT_KEY:   Q_KEY
} = process.env;

// scegli la chiave privata presente: testnet o mainnet
const PKEY = PKEY_TESTNET ?? LUMIGO_PRIVATE_KEY;

if (!LH_API_KEY || !PKEY || !NFT_CONTRACT ||
    !TW_CLIENT_ID || !TW_SECRET_KEY || !Q_URL || !Q_KEY) {
  console.error("❌  Variabili d'ambiente mancanti. Controlla i secrets (.env o GitHub).");
  process.exit(1);
}

/* ======= SDK init ======= */
const sdk = ThirdwebSDK.fromPrivateKey(PKEY!, "sepolia", {
  clientId:  TW_CLIENT_ID!,
  secretKey: TW_SECRET_KEY!,
});
const qdrant  = new QdrantClient({ url: Q_URL!, apiKey: Q_KEY! });
const owner   = new Wallet(PKEY!).address;

/* ======= helper SHA-256 ======= */
async function sha256(buf: Buffer) {
  const crypto = await import("crypto");
  return crypto.createHash("sha256").update(buf).digest("hex");
}

/* ======= Upload su Lighthouse ======= */
async function uploadToLighthouse(buf: Buffer, filename: string): Promise<string> {
  const form = new FormData();
  form.append("file", buf, filename);

  const res = await axios.post(
    "https://node.lighthouse.storage/api/v0/add",
    form,
    {
      headers: { Authorization: `Bearer ${LH_API_KEY}`, ...form.getHeaders() },
      maxBodyLength: Infinity,
    }
  );
  return (res.data as any).Hash as string;        // CID
}

/* ======= Qdrant: crea collection se manca ======= */
async function ensureCollection() {
  const list = await qdrant.getCollections();
  if (!list.collections?.some(c => c.name === "open_data")) {
    console.log("🔨  Creo collection open_data su Qdrant…");
    await qdrant.createCollection("open_data", {
      vectors: { size: 384, distance: "Cosine" },
    });
    console.log("✅  Collection open_data creata.");
  }
}

/* ======= Mint adattivo (Collection ↔ Drop) ======= */
async function mintDataset(contract: any, metadata: any): Promise<number> {
  try {
    // Tentativo rapido (NFT Collection)
    const tx = await contract.erc721.mintTo(owner, metadata);
    return tx.id.toNumber();
  } catch (err: any) {
    const msg = String(err?.message ?? "");
    const fallback =
      msg.includes("ERC721Mintable") || msg.includes("ExtensionNotImplemented");
    if (!fallback) throw err;

    // Fallback NFT Drop
    console.log("↪️  Switch a lazyMint + claim (NFT Drop) …");
    await contract.erc721.lazyMint(1, metadata);
    const claimed = await contract.erc721.claimTo(owner, 1);
    return claimed[0].id.toNumber();
  }
}

/* ======= Processo singolo file ======= */
async function processFile(url: string) {
  console.log("⬇️  Download:", url);
  const buf  = Buffer.from((await axios.get(url, { responseType: "arraybuffer" })).data);
  const hash = await sha256(buf);

  console.log("⬆️  Upload su Lighthouse…");
  const cid = await uploadToLighthouse(buf, path.basename(url));
  console.log("📦  CID:", cid);

  console.log("🪙  Mint NFT su thirdweb…");
  const contract = await sdk.getContract(NFT_CONTRACT!);
  const meta = {
    name: path.basename(url),
    description: `Auto-import dataset (${url})\nSHA-256: ${hash}`,
    image: "ipfs://QmTkCqtsPlaceholder",
    attributes: [{ trait_type: "ipfs_cid", value: cid }],
  };
  const tokenId = await mintDataset(contract, meta);
  console.log("✅  NFT mintato, tokenId:", tokenId);

  /* registry csv */
  const csv = path.resolve("dataset_registry.csv");
  if (!fs.existsSync(csv)) {
    fs.writeFileSync(
      csv,
      "Dataset Name,CID (Lighthouse),NFT Contract Address,Token ID,Owner Wallet Address\n"
    );
  }
  fs.appendFileSync(csv, `${meta.name},${cid},${NFT_CONTRACT},${tokenId},${owner}\n`);

  /* Qdrant upsert */
  await qdrant.upsert("open_data", {
    wait: true,
    points: [{
      id: tokenId,
      vector: Array(384).fill(0),
      payload: { cid, tokenId, owner, source_url: url, contract: NFT_CONTRACT },
    }],
  });

  console.log("🏁  Completato:", url, "\n");
}

/* ======= Main ======= */
async function main() {
  await ensureCollection();

  const seedPath = path.resolve("packages/bot/seed.txt");
  if (!fs.existsSync(seedPath)) {
    console.error("❌  seed.txt non trovato:", seedPath);
    process.exit(1);
  }
  const urls = fs.readFileSync(seedPath, "utf-8").split("\n").filter(Boolean);
  for (const u of urls) {
    try {
      await processFile(u.trim());
    } catch (e) {
      console.error("❌  Errore su", u, e);
    }
  }
}

main();
