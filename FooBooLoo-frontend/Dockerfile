# Build stage
FROM node:18 AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app source code and build the frontend
COPY . . 
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build output
COPY --from=build /app/dist .  

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf  

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
