docker rm -f midiverse
docker rm -f mariadb
docker rm -f nginx
docker-compose build
docker-compose up -d