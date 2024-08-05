FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    libfreetype-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    zlib1g-dev \
    nodejs \
    npm && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) gd zip pdo_mysql && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd pdo pdo_mysql zip && \
    pecl install xdebug && \
    docker-php-ext-enable xdebug

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

#COPY midiverse.conf /etc/apache2/sites-available/

COPY ./start_container.sh /var/www/html/

# Change permissions for the script
RUN chmod +x /var/www/html/start_container.sh

ENTRYPOINT ["sh", "/var/www/html/start_container.sh"]
EXPOSE 9000 8000 5173

# Run the application for dev: localhost:8000 and localhost:5173
# CMD ["php-fpm"]

