import {BasePage} from "./base"
import {Locator, Page} from "@playwright/test"

export class Homepage extends BasePage {
  readonly nextSlide: Locator;
  readonly prevSlide: Locator;

  constructor(page: Page) {
    super(page)
    this.nextSlide = page.locator('.slideshow-next')
    this.prevSlide = page.locator('.slideshow-prev')
  }

  async showNextSlide() {
    await this.nextSlide.click()
  }

  async showPrevSlide() {
    await this.prevSlide.click()
  }
}