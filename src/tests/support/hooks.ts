import {Browser, chromium, Locator, Page} from "@playwright/test"
import {BasePage} from "../pages/base"
import {After, AfterAll, Before, setDefaultTimeout} from "@cucumber/cucumber"
import {BASE_URL} from "../constants"
import {Homepage} from "../pages/home"

export let browser: Browser;
export let page: Page;
export let homepage: BasePage;

setDefaultTimeout(60000)

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

export const getSwatchOptions = async (locator: Locator) => {
  const options = [];
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    const li = locator.nth(i);
    const classAttr = await li.getAttribute('class');
    if (classAttr) {
      const classes = classAttr.split(' ');
      for (const cls of classes) {
        if (cls.startsWith('option-')) {
          const option = cls.replace('option-', '').replace('-', ' ');
          options.push(option)
        }
      }
    }
  }
  return options;
}

export const selectSwatchOption = async (locator: Locator, option: number | string) => {
  if (typeof option === 'number') {
    const index = option - 1; // convert to zero-based index
    const li = locator.nth(index);
    await li.click();
  } else if (typeof option === 'string') {
    const options = await getSwatchOptions(locator);
    const index = options.findIndex(opt => opt.toLowerCase() === option.toLowerCase());
    if (index === -1) {
      throw new Error(`Option "${option}" not found in swatch options: ${options.join(', ')}`);
    }
    const li = locator.nth(index);
    await li.click();
  }
}