FROM nginx:latest

WORKDIR /var/www/html

RUN rm /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.crt /etc/nginx/ssl/nginx.crt
COPY nginx.key /etc/nginx/ssl/nginx.key

CMD ["nginx", "-g", "daemon off;"]