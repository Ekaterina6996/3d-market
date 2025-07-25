FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create uploads directory
RUN mkdir -p /app/uploads

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build

EXPOSE 3002
CMD ["npm", "start"]