# VARCAVIA · Engineering Roadmap (v2025‑07‑03)

---

## ✅ Completato (green‑check)

| Area | Dettaglio |
| ---- | --------- |
|      |           |

|   |
| - |

| **A0 · Foundation**      | • Dominio `varcavia.com`, Google Workspace e MX records• GitHub Org `VARCAVIA‑Inc`, repo **varcavia‑poc**• Codespaces + devcontainer (Node 22, PNPM, TS, ESLint)• CI GitHub Actions → **type‑check + lint** → **🟢 CI verde** |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A1 · Data stack**      | • Lighthouse API‑key valida, upload test CID• Qdrant Cloud cluster + collection `open_data` (384 dims Cosine)• Thirdweb → contratto **NFT Collection** (0xb864…9435) su Sepolia                                               |
| **A2 · Bot pipeline**    | • packages/bot/librarian.ts v0.3‑b ⇒ download ⇒ Lighthouse CID ⇒ mint/claim NFT (adaptive) ⇒ update CSV ⇒ upsert Qdrant ✔︎                                                                                                    |
| **A3 · CI Quality gate** | • ESLint 9 flat‑config, TS 5, skipLibCheck, esModuleInterop• pnpm run ci = local replica del CI                                                                                                                               |
| **A4 · IaC / Deploy**    | • render.yaml (valid) ⇒ services:  ↳ **flowise‑varcavia** (Docker)  ↳ **varcavia‑pages** (static placeholder)                                                                                                                 |

---

## 🔄 Processo produttivo (ad oggi)

1. **Dev loop locale**\
   `pnpm run dev` (SvelteKit) ⇢ live‑reload.
2. **Pre‑push gate**\
   `pnpm run ci` → blocca errori prima del push.
3. **CI GitHub Actions**\
   – Caches PNPM\
   – `tsc --noEmit`\
   – `eslint .` (no warnings)\
   – future: unit‑test.
4. **Codespaces Live Share** (facoltativo)\
   pair‑debug → patch immediata.
5. **Deploy**\
   `git push` → Render (autoDeploy = false) manual redeploy.

**Migliorie introdotte**

- Flat‑config ESLint → config singola, zero eredità.
- Ignoriamo `.svelte-kit/**`, `*.d.ts`, config files → lint mirato.
- Script **ci** unifica type‑check + lint.
- Blueprint Render valido (runtime docker / static).

---

## 📍 Prossimi milestone

| ID     | Obiettivo                    | Step operativi                                                                                                                                                                                                      |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2A** | **Deploy Flowise** su Render | ◦ Dashboard Render → New Blueprint◦ Inserire ENV: `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `FLOWISE_PASSWORD`◦ Verify login [https://flowise‑varcavia.onrender.com](https://flowise‑varcavia.onrender.com) |
| **2B** | **Marketplace front‑end**    | ◦ Aggiungere `src/routes/marketplace/+page.svelte` (Thirdweb SDK + Tailwind UI)◦ Mostrare NFT dataset, bottone claim, chat widget (iframe Flowise)                                                                  |
| **2C** | **Bot automation**           | ◦ GitHub Action `librarian.yaml` schedulata (cron nightly)◦ Secrets: LH\_API\_KEY, PKEY\_TESTNET, …◦ Append nuovi CID ↔ NFT ↔ Qdrant                                                                                |
| **2D** | **Security pass**            | ◦ Ruoli minimi su Render & Qdrant◦ Vault GitHub Secrets org‑level                                                                                                                                                   |

---

## 🗺 Backlog (Q3‑Q4 2025)

- **Edge RAG**: embed → stream via Qdrant Vectors.
- **Tokenomics** UI dashboard.
- **DAO governance** (Cosmos SDK chain).
- **Telemetry**: OpenTelemetry + Grafana Cloud.

---

## 📌 How‑to rapido

```bash
# lint + ts prima del push
yarn ci     # o pnpm run ci

# librarian bot (dev)
PNPM_RUN="LH_API_KEY=… PKEY_TESTNET=… TW_SECRET_KEY=…" \
  pnpm dlx tsx -r dotenv/config packages/bot/librarian.ts

# deploy Flowise manuale (Render dashboard)
```

> Canvas aggiornato ✓ — prossima azione: **2A Deploy Flowise**.

