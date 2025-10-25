import {BasePage} from "./base"
import {Locator, Page} from "@playwright/test"

export class Loginpage extends BasePage {
  readonly emailBox: Locator;
  readonly passwordBox: Locator;
  readonly loginButton: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    super(page)
    this.emailBox = this.page.getByRole('textbox', { name: 'Email Address' })
    this.passwordBox = this.page.locator("#pass")
    this.loginButton = this.page.getByRole('button', { name: 'Login' })
    this.signupButton = this.page.getByRole('button', { name: 'Create an Account' })
  }

  async login(email: string, password: string) {
    await this.emailBox.fill(email)
    await this.passwordBox.fill(password)
    const loginButton = this.page.getByRole('button', { name: 'Login' })
    await loginButton.click()
  }

  async gotoSignupPage() {
    await this.signupButton.click()
  }
}