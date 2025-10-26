import {BasePage} from "./base"
import {Locator, Page} from "@playwright/test"

export class CartItem {
  readonly baseLocator: Locator
  readonly nameLocator: Locator
  readonly quantityLocator: Locator
  readonly priceLocator: Locator
  readonly subtotalLocator: Locator
  readonly colorLocator: Locator
  readonly sizeLocator: Locator

  constructor(baseLocator: Locator) {
    this.baseLocator = baseLocator;
    this.nameLocator = this.baseLocator.locator('.product-name a');
    this.quantityLocator = this.baseLocator.locator('.input-text.qty');
    this.priceLocator = this.baseLocator.locator('.product-cart-price .cart-price .price');
    this.subtotalLocator = this.baseLocator.locator('.product-cart-total .cart-price .price');
    this.colorLocator = this.baseLocator.locator('.item-options dd').nth(0);
    this.sizeLocator = this.baseLocator.locator('.item-options dd').nth(1);
  }

  async extractData() {
    return {
      name: await this.nameLocator.innerText(),
      quantity: await this.quantityLocator.inputValue(),
      price: await this.priceLocator.innerText(),
      subtotal: await this.subtotalLocator.innerText(),
      color: await this.colorLocator.innerText(),
      size: await this.sizeLocator.innerText(),
    }
  }
}

export class CartPage extends BasePage {
  readonly messagesContainer: Locator
  readonly cartItemsContainer: Locator

  constructor(page: Page) {
    super(page)
    this.messagesContainer = this.page.locator('.main-container .main .messages')
    this.cartItemsContainer = this.page.locator('#shopping-cart-table tbody')
  }

  async getMessages() {
    const messages = [];
    const messageLocators = this.messagesContainer.locator('li');
    const count = await messageLocators.count();
    for (let i = 0; i < count; i++) {
      const li = messageLocators.nth(i);
      const text = await li.innerText();
      messages.push(text.trim());
    }
    return messages;
  }

  async getItems() {
    const items = [];
    const rowLocators = this.cartItemsContainer.locator('tr');
    const count = await rowLocators.count();
    for (let i = 0; i < count; i++) {
      const row = rowLocators.nth(i);
      const item = new CartItem(row);
      items.push(item);
    }
    return items;
  }
}