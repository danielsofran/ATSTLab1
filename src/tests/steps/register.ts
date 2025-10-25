import {
  When,
  Then, DataTable
} from "@cucumber/cucumber"

import { expect } from "@playwright/test";
import {homepage, page} from "../support/hooks"
import {SignupPage} from "../pages/signup"

let signupPage: SignupPage;

When("I navigate to the registration page", async function () {
  await homepage.gotoSignupPage();
});

When("I fill in the registration form with the following valid details:", async function (dataTable: DataTable) {
  signupPage = new SignupPage(page);
  const data = dataTable.hashes()[0]
  await signupPage.signup(data.firstName, data.lastName, data.email, data.password, data.confirmation);
})

Then("I should see a register confirmation message", async function () {
  await expect(page).toHaveURL(/.*customer\/account\//);
  await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
  await expect(page.getByText("Thank you for registering with Madison Island.")).toBeVisible();
});