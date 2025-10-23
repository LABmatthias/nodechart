# Gebruik Node.js 20 image
FROM node:20-bullseye

# Werkdirectory instellen
WORKDIR /usr/src/app

# Kopieer package.json en package-lock.json
COPY package*.json ./

# Puppeteer en dependencies installeren
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
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

# Installeer Google Chrome
RUN wget -q -O /tmp/chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt install -y /tmp/chrome.deb \
    && rm /tmp/chrome.deb

# Kopieer projectbestanden
COPY . .

# Installeer npm dependencies
RUN npm install

# Zet environment variable voor Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Open poort (optioneel, Cloud Run gebruikt deze dynamisch)
EXPOSE 8080

# Start je server
CMD ["node", "node_scripts/chart-server.js"]
