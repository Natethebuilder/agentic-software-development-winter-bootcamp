import { expect, test } from '@playwright/test'

for (const route of ['/', '/#/', '/#/deck', '/#faq']) {
  test(`opens only the slide deck at ${route}`, async ({ page }) => {
    await page.goto(route)

    await expect(page).toHaveURL(/#\/deck$/)
    await expect(page.getByRole('navigation', { name: 'Slide navigation' })).toBeVisible()
    await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 1 of 18')
    const heading = page.locator('.deck h1').first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('AI-Native Software Development Lifecycle')
    await expect(heading).toContainText('Winter Bootcamp')
    await expect(page.getByRole('link', { name: /Website|Slide deck/ })).toHaveCount(0)
    await expect(page.locator('[data-panel]')).toHaveCount(0)
    await expect(page).toHaveTitle('AI-Native Software Development Lifecycle Winter Bootcamp')
  })

}

test('keeps main content and navigation inside the viewport', async ({ page }) => {
  await page.goto('/')
  const viewport = page.viewportSize()
  for (const selector of ['.deck h1', '.deck-navbar']) {
    const element = page.locator(selector).first()
    await expect(element).toBeVisible()
    const box = await element.boundingBox()
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
  }
  const next = await page.getByRole('button', { name: 'Next slide', exact: true }).boundingBox()
  expect(next.y).toBeGreaterThanOrEqual(0)
  expect(next.y + next.height).toBeLessThanOrEqual(viewport.height)
})

test('keeps slide navigation working without switching view on hash changes', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 2 of 18')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 3 of 18')
  await page.getByRole('button', { name: 'Previous slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 2 of 18')

  await page.evaluate(() => { window.location.hash = '#/' })
  await expect(page).toHaveURL(/#\/deck$/)
  await expect(page.getByRole('navigation', { name: 'Slide navigation' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Website|Slide deck/ })).toHaveCount(0)
})

test('preserves query parameters when sending the main URL to the deck', async ({ page }) => {
  await page.goto('/?campaign=winter#/')
  await expect(page).toHaveURL('/?campaign=winter#/deck')
})

test('opens registration directly from the main view', async ({ page }) => {
  // Verify our dialog and embed without depending on the external form service.
  await page.route('https://forms.cloud.microsoft/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<html><body>Registration form</body></html>' }))
  await page.goto('/')
  await expect(page.locator('iframe')).toHaveCount(0)
  await page.getByRole('button', { name: 'Register now' }).click()
  const dialog = page.getByRole('dialog', { name: 'Bootcamp registration' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('iframe')).toHaveAttribute('src', /forms\.cloud\.microsoft\/.*embed=true/)
  await page.getByRole('button', { name: 'Close registration' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: 'Slide navigation' })).toBeVisible()
})
