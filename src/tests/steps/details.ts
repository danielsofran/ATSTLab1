import {Then, When} from "@cucumber/cucumber"
import {page} from "../support/hooks"
import {expect} from "@playwright/test"
import {ProductsPage} from "../pages/products"
import {ProductPage} from "../pages/product"
import {CartPage} from "../pages/cart"

let productsPage: ProductsPage
let productPage: ProductPage

let productData: { [key: string]: any } = {}
let productColor = ''
let productSize = ''

When('I view the {int}nth product details', async function (index: number) {
  productsPage = new ProductsPage(page)
  const products = await productsPage.getProducts()
  if (index < 0 || index > products.length) { // fail test
    throw new Error(`Product index ${index} is out of bounds. There are only ${products.length} products.`)
  }
  const product = products[index - 1]
  productData = await product.extractData()
  await product.viewDetails()
})

Then('I should be able to zoom in the product\'s picture', async function () {
  productPage = new ProductPage(page)
  expect(await productPage.canZoomImage()).toBe(true)
})

When('I click the "Add to Cart" button from the details page', async function () {
  productPage = new ProductPage(page)
  await productPage.addToCart()
})

Then('I should see {int} error messages indicating that some fields are required', async function (errorNumber: number) {
  productPage = new ProductPage(page)
  const errors = await productPage.getRequiredFieldErrors()
  expect(errors.length).toBe(errorNumber)
  for (const error of errors)
    expect(error).toBe("This is a required field.")
})

When('I select the size {int} and color {int} from the details page', async function (size, color) {
  productPage = new ProductPage(page)
  productColor = await productPage.getColors().then(colors => colors[color - 1])
  productSize = await productPage.getSizes().then(sizes => sizes[size - 1])
  await productPage.selectSize(size)
  await productPage.selectColor(color)
})

When('I select the size {word} and color {word} from the details page', async function (size, color) {
  productPage = new ProductPage(page)
  productColor = color
  productSize = size
  await productPage.selectSize(size)
  await productPage.selectColor(color)
})

Then('The cart should contain the product', async function () {
  await expect(page).toHaveURL(/.*checkout\/cart\//)
  const cartPage = new CartPage(page)
  // message
  const messages = await cartPage.getMessages()
  expect(messages[0].toLowerCase()).toBe(productData.name.toLowerCase() + ' was added to your shopping cart.')
  // cart content
  const items = await cartPage.getItems()
  expect(items.length).toBe(1)
  const itemData = await items[0].extractData()
  expect(itemData.name.toLowerCase()).toBe(productData.name.toLowerCase())
  expect(itemData.color.toLowerCase()).toBe(productColor.toLowerCase())
  expect(itemData.size.toLowerCase()).toBe(productSize.toLowerCase())
  expect(itemData.quantity).toBe('1')
  expect(itemData.price).toBe(productData.price)
  expect(itemData.subtotal).toBe(productData.price)
})

Then('I should be able to view images of the product in the thumbnail gallery', async function () {
  productPage = new ProductPage(page)
  const existingPicsSources = await productPage.getExistingPictureSources()
  const thumbnailPicsSources = await productPage.getThumbnailSources()
  expect(thumbnailPicsSources.length).toBe(existingPicsSources.length)
  for (let i = 0; i < thumbnailPicsSources.length; i++) {
    expect(thumbnailPicsSources[i]).toBe(existingPicsSources[i]) // offset by 1 to exclude main image
  }
})

When('I click the {int}nth image from the thumbnail gallery', async function (index: number) {
  productPage = new ProductPage(page)
  await productPage.clickOnThumbnail(index - 1)
})

Then('I should see the {int}nth image in the main image viewer', async function (index: number) {
  productPage = new ProductPage(page)
  const existingPicsSources = await productPage.getExistingPictureSources()
  const mainImageSrc = await productPage.getMainImageSource()
  expect(mainImageSrc).toBe(existingPicsSources[index])
})

Then('The cart columns should fit to their content', async function () {
  const cartPage = new CartPage(page)
  expect(await cartPage.areColumnsFittedToContent()).toBeTruthy()
})