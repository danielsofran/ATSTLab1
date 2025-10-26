import {BasePage} from "./base"
import {Locator, Page} from "@playwright/test"
import {getSwatchOptions, selectSwatchOption} from "../support/hooks"

export class ProductPage extends BasePage {
  readonly productInfoContainer: Locator
  readonly colors: Locator
  readonly sizes: Locator

  readonly quantityBox: Locator
  readonly addToCartButton: Locator

  readonly addToWishlistButton: Locator
  readonly addToCompareButton: Locator

  readonly zoomContainer: Locator
  readonly zoomedImage: Locator

  private readonly existingPics: Locator
  readonly thumbnails: Locator

  constructor(page: Page) {
    super(page)
    this.quantityBox = this.page.getByRole('textbox', {name: /Qty/})
    this.addToCartButton = this.page.getByRole('button', {name: 'Add to Cart'})
    this.addToWishlistButton = this.page.getByRole('link', {name: 'Add to Wishlist'})
    this.addToCompareButton = this.page.getByRole('link', {name: 'Add to Compare'})
    this.productInfoContainer = this.page.locator('#product-options-wrapper')
    this.colors = this.page.locator("#configurable_swatch_color li")
    this.sizes = this.page.locator("#configurable_swatch_size li")

    this.zoomContainer = this.page.locator('.zoomContainer')
    this.zoomedImage = this.zoomContainer.locator('.zoomWindowContainer .zoomWindow')

    const existingPicsContainer = this.page.locator('.product-img-box .product-image-gallery')
    this.existingPics = existingPicsContainer.locator('img.gallery-image')
    this.thumbnails = this.page.locator('ul.product-image-thumbs').locator('li')
  }

  async canZoomImage(): Promise<boolean> {
    const zoomContainerHandle = await this.zoomContainer.elementHandle();

    if (!zoomContainerHandle) {
      console.log('cannot get the element handle for zoom container');
      return false;
    }

    try {
      // Use bounding box to calculate positions
      const bbox = await zoomContainerHandle.boundingBox();
      if (!bbox) {
        console.log('cannot get bounding box for zoom container');
        return false;
      }

      // zoomedImage should have display none
      const zoomedImageDisplay = await this.zoomedImage.evaluate((el) => {
        return window.getComputedStyle(el).display;
      })
      if (zoomedImageDisplay !== 'none') {
        console.log('zoomed image is visible');
        return false;
      }

      // Use page.mouse to control cursor directly
      await this.page.mouse.move(bbox.x+10, bbox.y+10, { steps: 5 });
      await this.page.waitForTimeout(300)

      // now the zoomed image should be visible
      return await this.zoomedImage.evaluate((el) => {
        return window.getComputedStyle(el).display !== 'none';
      });
    } catch (error: any) {
      console.log('Mouse movement failed:', error.message);
      return false;
    }
  }

  async getColors(): Promise<string[]> {
    return await getSwatchOptions(this.colors)
  }

  async getSizes(): Promise<string[]> {
    return await getSwatchOptions(this.sizes)
  }

  async selectColor(color: string | number) {
    await selectSwatchOption(this.colors, color)
  }

  async selectSize(size: string | number) {
    await selectSwatchOption(this.sizes, size)
  }

  async addToCart(quantity?: number) {
    if (quantity && quantity > 0) {
      await this.quantityBox.fill(quantity.toString())
    }
    await this.addToCartButton.click({timeout: 50000})
  }

  async getRequiredFieldErrors(): Promise<string[]> {
    const errorMessages = this.productInfoContainer.locator('.validation-advice')
    const messages = []
    const count = await errorMessages.count()
    for (let i = 0; i < count; i++) {
      const msg = await errorMessages.nth(i).innerText()
      messages.push(msg)
    }
    return messages
  }

  async getExistingPictureSources(): Promise<string[]> {
    const sources: string[] = []
    const count = await this.existingPics.count()
    for (let i = 1; i < count; i++) { // ignore the main image at index 0
      const src = await this.existingPics.nth(i).getAttribute('src')
      if (src && !sources.includes(src)) {
        sources.push(src)
      }
    }
    return sources
  }

  async getThumbnailSources(): Promise<string[]> {
    const sources: string[] = []
    const count = await this.thumbnails.count()
    for (let i = 0; i < count; i++) {
      const src = await this.thumbnails.nth(i).locator('a.thumb-link img').getAttribute('src')
      if (src) {
        sources.push(src)
      }
    }
    return sources
  }

  async clickOnThumbnail(index: number) {
    const thumbnail = this.thumbnails.nth(index)
    await thumbnail.click()
  }

  async getMainImageSource(): Promise<string | null> {
    const image = this.page.locator('#image-main')
    return await image.getAttribute('src')
  }
}