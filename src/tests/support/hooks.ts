import {Browser, chromium, Page} from "@playwright/test"
import {BasePage} from "../pages/base"
import {After, AfterAll, Before, setDefaultTimeout} from "@cucumber/cucumber"
import {BASE_URL} from "../constants"
import {Homepage} from "../pages/home"

export let browser: Browser;
export let page: Page;
export let homepage: BasePage;

setDefaultTimeout(40000)

Before(async () => {
  // Launch browser once, but create new context/page for each scenario
  if (!browser) {
    browser = await chromium.launch({
      headless: false,
      slowMo: 500,
      timeout: 30000,
    });
  }

  // Create new context and page for each scenario
  const context = await browser.newContext();
  page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 10000 });
  homepage = new Homepage(page);
});

After(async () => {
  // Close page after each scenario
  if (page) {
    await page.close();
  }
});

// Keep AfterAll for browser cleanup
AfterAll(async () => {
  if (browser) {
    await browser.close();
  }
});