# Gebruik een officiële Node.js image als basis
FROM node:20-bullseye

# Installeer Chrome dependencies
RUN apt-get update && apt-get install -y \
    gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
    libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 \
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
    libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libgbm1 lsb-release wget xdg-utils -y \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Installeer puppeteer afhankelijkheden
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Stel werkdirectory in
WORKDIR /app

# Kopieer package.json en package-lock.json
COPY package*.json ./

# Installeer Node.js dependencies
RUN npm install

# Kopieer de rest van de code
COPY . .

# Puppeteer launch opties
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV NODE_ENV=production

# Expose de poort waarop jouw server draait
EXPOSE 8080

# Start de server
CMD ["node", "node_scripts/chart-server.js"]
