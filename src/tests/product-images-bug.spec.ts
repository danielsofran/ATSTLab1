import { test, expect } from '@playwright/test'

test('Images of a product can be viewed in the product details page', async ({ page }) => {
  // Given: I am on a product details page that has multiple images
  await page.goto('http://qa1.dev.evozon.com/core-striped-sport-shirt-551.html')

  // existing picture sources
  const allPicsContainer = page.locator('.product-img-box .product-image-gallery')
  const images = allPicsContainer.locator('img.gallery-image')
  const imageCount = await images.count()
  expect(imageCount).toBeGreaterThan(1)
  const imageSrcs: string[] = []
  for (let i = 1; i < imageCount; i++) { // ignore the main image at index 0
    const src = await images.nth(i).getAttribute('src')
    if(src && !imageSrcs.includes(src)) {
      imageSrcs.push(src)
    }
  }

  // more views in the screen
  const moreViewsContainer = page.locator('ul.product-image-thumbs')

  // When: I click on the last image thumbnail in the "More Views" section
  const moreViewImages = moreViewsContainer.locator('li')
  const lastThumbnail = moreViewImages.nth(-1)
  await lastThumbnail.click()
  await page.waitForTimeout(1000)

  // Then: The main product image should update to show the clicked image
  const image = page.locator('#image-main')
  const mainImageSrc = await image.getAttribute('src')
  expect(mainImageSrc).toEqual(imageSrcs[imageSrcs.length - 1])
})

test('Images of a product can be viewed in thumbnails', async ({ page }) => {
  // Given: I am on a product details page that has multiple images
  await page.goto('http://qa1.dev.evozon.com/core-striped-sport-shirt-551.html')

  // existing picture sources
  const allPicsContainer = page.locator('.product-img-box .product-image-gallery')
  const images = allPicsContainer.locator('img.gallery-image')
  const imageCount = await images.count()
  expect(imageCount).toBeGreaterThan(1)
  const imageSrcs: string[] = []
  for (let i = 1; i < imageCount; i++) { // ignore the main image at index 0
    const src = await images.nth(i).getAttribute('src')
    if(src && !imageSrcs.includes(src)) {
      imageSrcs.push(src)
    }
  }

  // more views in the screen
  const moreViewsContainer = page.locator('ul.product-image-thumbs')

  // Then: The images should appear in the thumbnails section
  const moreViewImages = moreViewsContainer.locator('li') // ('a.thumbnail-link img')
  const moreViewCount = await moreViewImages.count()
  expect(moreViewCount).toBe(imageSrcs.length)
  for (let i = 0; i < moreViewCount; i++) {
    const src = await moreViewImages.nth(i).locator('a.thumb-link img').getAttribute('src')
    expect(src).toEqual(imageSrcs[i])
  }
})