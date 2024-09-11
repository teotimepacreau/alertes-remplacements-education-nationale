# l'image de Puppeteer est déjà construite au dessus de Node donc pas besoin d'installer Node en plus
FROM ghcr.io/puppeteer/puppeteer:latest 

# dossier qui sera la base dans le container
WORKDIR /app

# pour ne pas avoir à re-installer les node_modules à chaque fois 
COPY package.json /app

RUN npm install

# copies the entire project directory to the Docker image
COPY . /app

CMD [ "npm", "start"]