## ────────────────────────────────────
## Varcavia – utility targets
## Usage: make <target>
## ────────────────────────────────────

# Installa le dipendenze
setup:
	pnpm install

# Avvia il Librarian Bot localmente
bot:
	pnpm dlx tsx -r dotenv/config packages/bot/librarian.ts

# Effettua il login alla CLI di Render (serve RENDER_API_KEY)
render-login:
	render login --api-key $$RENDER_API_KEY

# Applica (o aggiorna) il blueprint su Render
render-deploy:
	render blueprint apply --yes --file render.yaml

# Vedi i log del servizio Flowise su Render
render-logs:
	render logs flowise-varcavia

# Pulisce moduli e cache
clean:
	rm -rf node_modules .pnpm-store
