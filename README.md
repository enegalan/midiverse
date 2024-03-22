# 👋 Welcome to <b>miDiverse!</b>

## Set up the development environment
Make sure you have <b>Node.js</b> & <b>npm</b> (Node Package Manager) v18.18.0 and <b>Composer</b> installed on your system.
### On Windows OS
Get Node.js and npm v18.18.0 from the official website (https://nodejs.org/) and Composer from the official Laravel website (https://getcomposer.org/).
### On Linux/Ubuntu OS
#### Install Node Version Manager
<pre>
  <code>curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash</code>
  <code>source ~/.zshrc</code>
  <code>export NVM_DIR="$HOME/.nvm"</code>
  <code>[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"</code>
  <code>[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"</code>
</pre>
## Verify Node Version Manager is installed
<pre>
  <code>nvm</code>
</pre>

## Install a node version
<pre>
  <code>nvm ls-remote</code>
  <code>nvm install [version]</code>
  <code>nvm use [version]</code>
</pre>

#### Install composer
<pre>
  <code>sudo apt install composer</code>
</pre>
Verify composer is correctly installed
<pre>
  <code>composer</code>
</pre>
#### Set up web server and PHP
<b>Laravel</b> requires a web server like <b>Apache2</b> or <b>Nginx</b> and <b>PHP</b>.
<pre>
  <code>sudo apt install apache2 php libapache2-mod-php php-curl php-xml php-dom php-mysql</code>
</pre>
Enable the Apache rewrite module for Laravel:
<pre>
  <code>sudo a2enmod rewrite</code>
</pre>
### Install mariadb:
<pre>
  <code>sudo apt install mariadb-server</code>
  <code>sudo systemctl start mariadb</code>
  <code>sudo systemctl enable mariadb</code>
  <code>sudo mysql_secure_installation</code>
</pre>

## Upgrade npm version to the latest
<pre>
  <code>npm install npm@latest</code>
</pre>
## Create the Laravel project
<pre>
  <code>composer create-project laravel/laravel midiverse</code>
  <code>cd midiverse</code>
</pre>

## Configure the .env file
Configure the <code>.env</code> file in the root of your Laravel project based on your database credentials and other necessary settings.

## Install Laravel dependencies
Run the following command to install Laravel dependencies:
<pre>
  <code>composer install</code>
  <code>composer update</code>
</pre>

## Include React into the Laravel project
Run the following command to install React:
<pre>
  <code>npm install create-vite</code>
  <code>npm install @vitejs/plugin-react</code>
  <code>npm install react@latest react-dom@latest</code>
</pre>

## Build React assets
<pre>
  <code>npm install</code>
</pre>

# For developers
Clone this repository, create a <code>.env</code> file and configure it, there will be a template of <code>.env</code> in <code>.env.example</code> file.

## Local development
Run the following commands:
<pre>
  <code>composer install</code>
  <code>npm install create-vite</code>
</pre>

### Run Laravel development server
In two terminals run the following commands:
<pre>
  <code>npm run dev</code>
</pre>
<pre>
  <code>php artisan serve</code>
</pre>
Or run the following custom command:
<pre>
  <code>npm run midiverse</code>
</pre>

## Docker deploy
To build and start a container with the application, you can use the provided Dockerfile.
<pre>
  <code>docker build -t midiverse .</code>
</pre>
<pre>
  <code>docker run -d -p 8000:8000 -p 5173:5173 midiverse</code>
</pre>
To get container's IP address the first step is to get container's ID via:
<pre>
  <code>docker ps</code>
</pre>
<pre>
  <code>docker inspect {containerID} | grep "IPAddress"</code>
</pre>

# Run this command for image uploads
<pre>
  <code>php artisan storage:link</code>
</pre>