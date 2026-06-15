FROM node:18-alpine AS build
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install once with the flag you need
RUN npm install --legacy-peer-deps

# Copy rest of source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2 - Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]