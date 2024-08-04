#!/bin/bash

cd /var/www/html/

composer install --no-scripts

npm install --verbose && npm run build

php-fpm
