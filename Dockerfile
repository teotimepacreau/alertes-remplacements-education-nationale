# l'image de Puppeteer est déjà construite au dessus de Node donc pas besoin d'installer Node en plus
FROM ghcr.io/puppeteer/puppeteer:latest 

# dossier qui sera la base dans le container
WORKDIR /app

# on commence par copier le package.json pour pouvoir ensuite installer les dépendances
COPY package.json /app

# on installe les dépendances
RUN npm install

# on copie tout notre dossier de code dans le workdir
COPY . /app

# on démarre le script
CMD [ "npm", "start"]
