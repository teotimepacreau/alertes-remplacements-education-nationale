FROM node:22

# dossier dans le container
WORKDIR /app

# pour ne pas avoir à re-installer les node_modules à chaque fois 
COPY package*.json /app

RUN npm install

# copies the entire project directory to the Docker image
COPY . /app

CMD [ "npm", "start"]