import {
  When,
  Then
} from "@cucumber/cucumber"

import { expect } from "@playwright/test";
import {Loginpage} from "../pages/login"
import {homepage, page} from "../support/hooks"

let loginpage: Loginpage;

When("I navigate to the login page", async function () {
  await homepage.gotoLoginPage();
  loginpage = new Loginpage(page);
});

When("I enter valid credentials", async function () {
  await loginpage.login("test-1@test.com", "test-1");
});

Then("I should be redirected to my account dashboard", async function () {
  await expect(page).toHaveURL(/.*customer\/account\//);
  await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
});

When("I enter invalid credentials", async function () {
  await loginpage.login("test-invalid-2@test.com", "test-invalid-2");
})

Then("I should see an error message indicating invalid login", async function () {
  await expect(page).toHaveURL(/.*customer\/account\/login\//);
  const errorMessage = page.getByText('Invalid login or password.');
  await expect(errorMessage).toBeVisible();
});