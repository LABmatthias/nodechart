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
import puppeteer from "puppeteer-core";
import fs from 'fs';
import path from 'path';

export async function generateChartScreenshot({ school, leerlingId, schooljaar, periode, saveToFile = false }) {
  const url = `https://apps4lab.be/rapport/chart/${school}/${leerlingId}/${schooljaar}/${periode}`;

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true
    });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 600 });

  console.log(`Opening chart page: ${url}`);
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

