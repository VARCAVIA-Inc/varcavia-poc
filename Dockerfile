# Dockerfile per Render
FROM flowiseai/flowise:latest

# → aumenta l’heap di Node a 1 GB
ENV NODE_OPTIONS="--max-old-space-size=1024"

# porta esposta da Flowise
EXPOSE 3000
