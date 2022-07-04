FROM node:18-alpine

WORKDIR /app/node

COPY package*.json ./

RUN npm install 

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD [ "npm", "start"]