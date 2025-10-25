import {DataTable, Then, When} from "@cucumber/cucumber"
import {page, homepage} from "../support/hooks"
import {expect} from "@playwright/test"
import {ProductsPage} from "../pages/products"

let searchResultsPage: ProductsPage;

When(`I search for a product with the keyword {string}`, async function (keyword: string) {
  await homepage.search(keyword)
})

Then("I should see {int} search results related to {string}", async function (number: number, keyword: string) {
  await expect(page.getByRole('heading', { name: `Search results for '${keyword}'` })).toBeVisible();
  searchResultsPage = new ProductsPage(page)
  expect(await searchResultsPage.getNumberOfProducts()).toBe(number)
})

When("I sort the search results by name", async function () {
  searchResultsPage = new ProductsPage(page)
  await searchResultsPage.sortBy("Name")
})

Then("I should see the following products in search results:", async function (dataTable: DataTable) {
  searchResultsPage = new ProductsPage(page)
  const actualProducts = await searchResultsPage.getProducts()
  const expectedProducts = dataTable.hashes()
  expect(actualProducts.length).toBe(expectedProducts.length)
  for (let i = 0; i < expectedProducts.length; i++) {
    const expected = expectedProducts[i]
    const actual = actualProducts[i]
    expect(await actual.getName().then(rez => rez.toLowerCase())).toBe(expected.name.toLowerCase())
    expect(await actual.getPrice()).toBe(expected.price)
    expect(await actual.getOldPrice()).toBe(expected.oldPrice)
    expect(await actual.getRating()).toBe(expected.rating)
    const expectedColors = expected.colors.split(',').map(c => c.trim())
    expect(await actual.getColors()).toEqual(expectedColors)
  }
})

When("I enter the {string} category and choose the {string} subcategory", async function (category: string, subcategory: string) {
  await homepage.selectSubSection(category, subcategory)
})

When("I apply the price range filter {string}", async function (priceRange: string) {
  searchResultsPage = new ProductsPage(page)
  await searchResultsPage.filterByPrice(priceRange)
})