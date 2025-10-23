// chart-screenshot.js
/*ORIGINEEL CODE SNIPPET
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateChartScreenshot(school, leerlingId, schooljaar, periode) {
  const url = `http://localhost:3000/rapport/chart/${school}/${leerlingId}/${schooljaar}/${periode}`; // pas aan naar jouw dev URL

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Opening chart page: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wacht extra tijd als chart data asynchroon geladen wordt
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Screenshot map aanmaken als die niet bestaat
  const outputDir = path.resolve(__dirname, 'charts');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, `chart_${leerlingId}_${schooljaar}_${periode}.png`);
  await page.screenshot({ path: filePath });

  console.log(`Screenshot opgeslagen: ${filePath}`);
  await browser.close();
}

// Voorbeeld: meerdere charts genereren
(async () => {
  const charts = [
    { school: 'lab_sn', leerlingId: 1141, schooljaar: '2025-2026', periode: 'P1' },
    { school: 'lab_sn', leerlingId: 2293, schooljaar: '2025-2026', periode: 'P1' },
  ];

  for (const chart of charts) {
    await generateChartScreenshot(chart.school, chart.leerlingId, chart.schooljaar, chart.periode);
  }

  console.log('Alle screenshots gegenereerd!');
})();*/

// chart-screenshot.js
import puppeteer from "puppeteer";
import fs from 'fs';
import path from 'path';

/* ORIGINEEL DAT WERKTE
export async function generateChartScreenshot({ school, leerlingId, schooljaar, periode, saveToFile = false }) {
  const url = `https://apps4lab.be/rapport/chart/${school}/${leerlingId}/${schooljaar}/${periode}`;

  const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
    });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 800 });

  await page.goto(url, { waitUntil: 'networkidle0' });

  // Eventuele extra wachttijd voor asynchroon laden van charts
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Screenshot als buffer (base64)
  const screenshotBuffer = await page.screenshot({ encoding: 'base64' });

  // Optioneel: opslaan als bestand
  if (saveToFile) {
    const outputDir = path.resolve('./charts');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const filePath = path.join(outputDir, `chart_${leerlingId}_${schooljaar}_${periode}.png`);
    await fs.promises.writeFile(filePath, Buffer.from(screenshotBuffer, 'base64'));
    console.log(`Screenshot opgeslagen: ${filePath}`);
  }

  await browser.close();
  return screenshotBuffer;
}*/

export async function generateChartScreenshot({ school, leerlingId, schooljaar, periode, saveToFile = false }) {
  const url = `https://apps4lab.be/rapport/chart/${school}/${leerlingId}/${schooljaar}/${periode}`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });

  try {
    const page = await browser.newPage();

    // Eerst naar de pagina navigeren
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wacht tot het chart-element er is (max 5 seconden)
    await page.waitForSelector('#chart-export', { timeout: 5000 });

    // Lees dynamisch de hoogte van het chart-element
    const chartHeight = await page.$eval('#chart-export', el => {
        const styleHeight = el.style.height;
        if (styleHeight) return parseInt(styleHeight);
        return parseInt(el.dataset.height) || 800;
    });

    // Stel viewport in (breedte 1200, hoogte chartHeight + padding)
    await page.setViewport({ width: 1200, height: chartHeight + 10 });
 
    // Extra wachttijd voor React chart render
    await new Promise(r => setTimeout(r, 500));

    // Screenshot in base64
    const screenshotBuffer = await page.screenshot({ encoding: 'base64' });

    // Optioneel opslaan naar bestand
    if (saveToFile) {
      const outputDir = path.resolve('./charts');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

      const filePath = path.join(outputDir, `chart_${leerlingId}_${schooljaar}_${periode}.png`);
      await fs.promises.writeFile(filePath, Buffer.from(screenshotBuffer, 'base64'));
      console.log(`Screenshot opgeslagen: ${filePath}`);
    }

    return screenshotBuffer;
  } finally {
    await browser.close();
  }
}

// Test-run lokaal
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const base64 = await generateChartScreenshot({
      school: 'lab_sn',
      leerlingId: 1141,
      schooljaar: '2025-2026',
      periode: 'P1',
      saveToFile: true
    });
    console.log('Screenshot base64 lengte:', base64.length);
  })();
}

