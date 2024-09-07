FROM node

# pour ne pas avoir à re-installer les node_modules à chaque fois 
COPY package*.json ./

RUN npm install

# copies the entire project directory to the Docker image
COPY . .

CMD [ "npm", "start"]