#!/bin/bash

cd /var/www/html/midiverse

composer install --no-scripts

npm install --verbose

echo 'finished!!'

exit 1;
