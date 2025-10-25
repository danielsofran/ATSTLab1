import {BasePage} from "./base"
import {Page} from "@playwright/test"


export class SignupPage extends BasePage {
  readonly firstNameBox;
  readonly middleNameBox;
  readonly lastNameBox;
  readonly emailBox;
  readonly passwordBox;
  readonly confirmPasswordBox;
  readonly newsletterCheckbox;

  readonly createAccountButton;
  readonly backButton;

  constructor(page: Page) {
    super(page)
    this.firstNameBox = this.page.getByRole('textbox', { name: 'First Name *' })
    this.middleNameBox = this.page.getByRole('textbox', { name: 'Middle Name/Initial' })
    this.lastNameBox = this.page.getByRole('textbox', { name: 'Last Name *' })
    this.emailBox = this.page.getByRole('textbox', { name: 'Email Address *' })
    this.passwordBox = this.page.locator("#password")
    this.confirmPasswordBox = this.page.locator("#confirmation")
    this.newsletterCheckbox = this.page.getByRole('checkbox', { name: 'Sign Up for Newsletter' })
    this.createAccountButton = this.page.getByRole('button', { name: 'Register' })
    this.backButton = this.page.getByRole('link', { name: '« Back' })
  }

  async signup(firstName: string, lastName: string, email: string, password: string, confirmPassword: string) {
    await this.firstNameBox.fill(firstName)
    await this.lastNameBox.fill(lastName)
    await this.emailBox.fill(email)
    await this.passwordBox.fill(password)
    await this.confirmPasswordBox.fill(confirmPassword)
    await this.createAccountButton.click()
  }
}