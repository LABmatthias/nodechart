# Gebruik Node.js 20 image
FROM node:20-bullseye

# Werkdirectory instellen
WORKDIR /usr/src/app

# Puppeteer en dependencies installeren
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxtst6 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libatk1.0-0 \
    libcups2 \
    libatk-bridge2.0-0 \
    libxrandr2 \
    libgtk-3-0 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Kopieer package.json en package-lock.json
COPY package*.json ./
# Installeer npm dependencies
RUN npm ci
# Kopieer projectbestanden
COPY . .


# Zet environment variable voor Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Open poort (optioneel, Cloud Run gebruikt deze dynamisch)
EXPOSE 8080

# Start je server
CMD ["node", "node_scripts/chart-server.js"]
