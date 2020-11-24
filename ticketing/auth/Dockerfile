FROM node:12

ENV CI=true

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]