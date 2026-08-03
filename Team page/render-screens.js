const { chromium } = require('/Users/lenguyenhoangthao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');

const htmlPath = 'file://' + path.resolve('/Users/lenguyenhoangthao/Documents/Outmarket Vibe Code/Team page/index.html');
const outDir = path.resolve('/Users/lenguyenhoangthao/Documents/Outmarket Vibe Code/Team page/exports');
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1 });

  async function reset() {
    await page.goto(htmlPath, { waitUntil: 'load' });
    await wait(250);
  }

  await reset();
  await page.screenshot({ path: path.join(outDir, 'collab-team-members.png') });

  await reset();
  await page.click('[data-team="all-members"]');
  await wait(150);
  await page.screenshot({ path: path.join(outDir, 'all-members-resource-tree.png') });

  await reset();
  await page.click('[data-team="all-members"]');
  await wait(150);
  await page.click('#open-modal');
  await wait(150);
  await page.screenshot({ path: path.join(outDir, 'create-team-modal.png') });

  await browser.close();
})();
