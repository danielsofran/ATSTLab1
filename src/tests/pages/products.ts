import {BasePage} from "./base"
import {Locator, Page} from "@playwright/test"
import {getSwatchOptions} from "../support/hooks"

export class ProductItem {
  private readonly baseLocator: Locator

  constructor(baseLocator: Locator) {
    this.baseLocator = baseLocator;
  }

  async getName() {
    return await this.baseLocator.locator('.product-info .product-name a').innerText()
  }

  async getPrice() {
    const defaultPriceLocator = this.baseLocator.locator('.price-box .regular-price')
    if (await defaultPriceLocator.count() > 0) {
      return await defaultPriceLocator.locator('.price').innerText();
    }
    const specialPriceLocator = this.baseLocator.locator('.price-box .special-price')
    if (await specialPriceLocator.count() > 0) {
      return await specialPriceLocator.locator('.price').innerText();
    }
    return '';
  }

  async getOldPrice() {
    const oldPriceLocator = this.baseLocator.locator('.price-box .old-price .price');
    if (await oldPriceLocator.count() > 0) {
      return await oldPriceLocator.innerText();
    }
    return '';
  }

  async getRating() {
    const div = this.baseLocator.locator('.ratings .rating-box .rating');
    if (!await div.isVisible()) {
      return '';
    }
    // get style and width percentage
    const style = await div.getAttribute('style');
    if (style) {
      const match = style.match(/width:\s*(\d+)%/);
      if (match && match[1]) {
        // assuming 5 stars, each star is 20%
        return match[1] + '%';
      }
    }
    return '';
  }

  async getColors() {
    const ul = this.baseLocator.locator('ul.configurable-swatch-list li');
    // now get all li classes and remove the option- prefix
    return await getSwatchOptions(ul);
  }

  async extractData() {
    return {
      name: await this.getName(),
      price: await this.getPrice(),
      oldPrice: await this.getOldPrice(),
      rating: await this.getRating(),
      colors: await this.getColors(),
    }
  }

  async viewDetails() {
    await this.baseLocator.locator('.product-info .product-name a').click();
    await this.baseLocator.page().waitForLoadState('networkidle');
  }

  async addToWishlist() {
    const button = this.baseLocator.getByRole("link", {name: "Add to Wishlist"}).first()
    await button.click();
  }

  async addToCompare() {
    const button = this.baseLocator.getByRole("link", {name: "Add to Compare"}).first()
    await button.click();
  }
}

export class ProductsPage extends BasePage {
  readonly sortByDropdown;
  readonly productsList;
  readonly productsGrid;
  readonly viewAsGridButton;
  readonly viewAsListButton;
  readonly items;

  constructor(page: Page) {
    super(page);
    this.sortByDropdown = this.page.locator("select[title='Sort By']").first();
    this.productsList = this.page.locator("ol.products-list");
    this.productsGrid = this.page.locator("ul.products-grid");
    this.viewAsGridButton = this.page.locator('.view-mode .grid');
    this.viewAsListButton = this.page.locator('.view-mode .list');

    this.items = this.page.locator('li.item');
  }

  async getNumberOfProducts() {
    return await this.items.count();
  }

  async getProducts() {
    const products = [];
    const count = await this.items.count();
    for (let i = 0; i < count; i++) {
      const itemLocator = this.items.nth(i);
      const product = new ProductItem(itemLocator);
      products.push(product);
    }
    return products;
  }

  async sortBy(option: 'Name' | 'Price' | "Relevance") {
    await this.sortByDropdown.selectOption({ label: option })
    // wait for request to finish
    await this.page.waitForLoadState('networkidle');
    // wait for url to contain sort parameter
    await this.page.waitForURL(/order=name/);
  }

  async filterByPrice(priceRange: string) {
    const prices = priceRange.split('-');
    if (prices.length !== 2) {
      throw new Error('Invalid price range format. Expected format: "min-max"');
    }
    const minPrice = prices[0].trim().replace(/\$/g, '\\$')
    const maxPrice = prices[1].trim().replace(/\$/g, '\\$')
    const regex = new RegExp(`${minPrice}\\s*-\\s*${maxPrice}\\s*`, 'i');
    const filterLink = this.page.getByRole('link', { name: regex });
    await filterLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}