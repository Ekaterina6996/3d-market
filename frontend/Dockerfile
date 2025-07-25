FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Default port for create-react-app is 3000, but our gateway uses that.
# We will serve the static build with Nginx.
RUN npm run build

# --- Nginx Stage ---
FROM nginx:1.23-alpine

# Copy built assets from builder stage
COPY --from=0 /app/build /usr/share/nginx/html

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]