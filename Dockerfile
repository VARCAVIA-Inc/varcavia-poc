# Dockerfile
FROM flowise/flowise:release
# espone la porta standard di Flowise
EXPOSE 3000
# l’entrypoint dell’immagine base avvia già il server
