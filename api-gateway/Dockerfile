FROM node:16-alpine

WORKDIR /app

# Copy proto files first
COPY ../protos /app/src/protos

COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json .

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]