import {Page, expect, Locator} from "@playwright/test"

export enum MenuSections {
  WOMEN = 'WOMEN',
  MEN = 'MEN',
  ACCESSORIES = 'ACCESSORIES',
  HOME_DECOR = 'HOME & DECOR',
  SALE = 'SALE',
  VIP = 'VIP'
}

export class BasePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = this.page.getByRole('searchbox', { name: 'Search' });
    this.searchButton = this.page.getByRole('button', { name: 'Search' });
  }

  async navigateToHomepage() {
    await this.page.goto('http://qa1.dev.evozon.com/');
  }

  async gotoMenuSection(section: string) {
    const item = await this.hoverOverLink(section, true);
    await item.click();
    return item;
  }

  async selectSubSection(section: string, subSection: string) {
    await this.hoverOverLink(section, true);
    const subItem = this.page.getByRole('link', { name: subSection, exact: true });
    await subItem.click();
    return subItem;
  }

  async checkoutCart() {
    const cartIcon = this.page.getByRole('link', { name: 'Cart' });
    await cartIcon.click();
    return cartIcon;
  }

  async checkAccountOptions() {
    const accountIcon = this.page.getByRole('link', { name: 'Account', exact: true });
    await accountIcon.click();
    return accountIcon;
  }

  async gotoLoginPage() {
    await this.checkAccountOptions();
    // get #header-account list
    const accountMenu = this.page.locator('#header-account');
    const loginLink = accountMenu.getByRole('link', { name: 'Log In' });
    // if login link is visible click it, else we are already on login page
    if (await loginLink.isVisible()) {
      await loginLink.click();
    }
  }

  async gotoSignupPage() {
    await this.checkAccountOptions();
    // get #header-account list
    const accountMenu = this.page.locator('#header-account');
    const signupLink = accountMenu.getByRole('link', { name: 'Register' });
    await signupLink.click();
  }

  async logout() {
    await this.checkAccountOptions();
    // get #header-account list
    const accountMenu = this.page.locator('#header-account');
    const logoutLink = accountMenu.getByRole('link', { name: 'Log Out' });
    // if logout link is visible click it, else we are already logged out
    if (await logoutLink.isVisible()) {
      await logoutLink.click();
    }
  }

  private async hoverOverLink(linkText: string, exact?: boolean) {
    const link = this.page.getByRole('link', { name: linkText, exact: exact });
    await link.hover();
    return link;
  }
}