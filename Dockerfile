# Gebruik een Node.js slim image
FROM node:20-slim

# Installeer dependencies voor Puppeteer / Chrome
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates fonts-liberation libnss3 libxss1 lsb-release xdg-utils libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libasound2 libpangocairo-1.0-0 libpango-1.0-0 libgtk-3-0 libxshmfence1 libnss3-tools --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Werkdirectory
WORKDIR /app

# Kopieer package files
COPY package*.json ./

# Installeer npm dependencies
RUN npm install

# Kopieer rest van de code
COPY . .

# Expose poort 8080
EXPOSE 8080

# Start je server
CMD ["node", "node_scripts/chart-server.js"]
