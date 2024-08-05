docker compose rm -f midiverse
docker compose rm -f mariadb
docker compose rm -f nginx
docker compose build
docker compose up -d