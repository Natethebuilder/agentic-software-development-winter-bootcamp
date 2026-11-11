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

test('uses the reference cover only on the opening slide and retains snowfall', async ({ page }) => {
  await page.goto('/#/deck')
  const cover = page.locator('.slide').first()
  await expect(cover).toHaveCSS('background-image', /cover-bg[^"]*\.png/)
  const backgroundLoaded = await cover.evaluate(async (element) => {
    const url = getComputedStyle(element).backgroundImage.match(/url\("([^"]+)"\)/)[1]
    const image = new Image()
    image.src = url
    await image.decode()
    return image.naturalWidth > 0
  })
  expect(backgroundLoaded).toBe(true)
  await expect(page.locator('.snowfall')).toBeVisible()
  await expect.poll(() => page.locator('.snowfall').evaluate((canvas) =>
    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some((value) => value > 0),
  )).toBe(true)

  await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 2 of 18')
  await expect(page.locator('.slide').nth(1)).not.toHaveCSS('background-image', /cover-bg/)
  await expect(page.locator('.snowfall')).toBeVisible()
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

test('does not show a floating Copilot head on the cover or later slides', async ({ page }) => {
  await page.goto('/#/deck')
  await expect(page.locator('.slide').first().locator('.mascot-copilot')).toHaveCount(0)
  await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 2 of 18')
  await expect(page.locator('.floating-copilot')).toHaveCount(0)
})

test('presents three audience cards with matching compact session pills', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 2; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const audience = page.locator('.slide').nth(2)
  await expect(audience.locator('h3')).toHaveCount(3)
  await expect(audience.getByText('Engineering teams', { exact: true })).toHaveCount(0)
  await expect(audience.getByText('Recommended sessions:', { exact: true })).toHaveCount(3)
  const cards = [
    ['Product Owners & Product Managers', 'Turn scattered input into clear, reviewable requirements.'],
    ['Architects & Leads & Analysts', 'Assist during the design phase to ensure the outcome adheres to the architecture guidance.'],
    ['Developers & Testers', 'Build, verify, review and deploy focused changes.'],
  ]
  for (const [label, description] of cards) {
    const card = audience.getByText(label, { exact: true }).locator('..')
    await expect(card.getByText(description, { exact: true })).toBeVisible()
    const pills = card.getByText('Plan & Design', { exact: true }).locator('../..')
    const sessions = label === 'Developers & Testers'
      ? ['GitHub Copilot app', 'Plan & Design', 'Build & Test', 'Review & Operate', 'Evaluations', 'App Modernization']
      : label === 'Architects & Leads & Analysts'
        ? ['GitHub Copilot app', 'Plan & Design', 'App Modernization']
        : ['GitHub Copilot app', 'Plan & Design']
    await expect(pills.locator(':scope > span')).toHaveText(sessions)
    for (const session of sessions) {
      const pill = card.getByText(session, { exact: true }).locator('..')
      await expect(pill.locator('svg')).toHaveCount(0)
      await pill.scrollIntoViewIfNeeded()
      const pillBox = await pill.boundingBox()
      const cardBox = await card.boundingBox()
      expect(pillBox.x).toBeGreaterThanOrEqual(cardBox.x)
      expect(pillBox.x + pillBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width)
      expect(pillBox.height).toBeLessThan(45)
      expect(await pill.evaluate((element) => parseFloat(getComputedStyle(element).borderRadius))).toBeGreaterThanOrEqual(pillBox.height / 2)
    }
  }
  await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 4 of 18')
  await expect(page.locator('.slide').nth(3).locator('h1')).toHaveText('Six dates. The same six-session day.')
  await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 5 of 18')
  await expect(page.locator('.slide').nth(4).getByText('Complete it during the bootcamp', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Previous slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 4 of 18')
  await page.getByRole('button', { name: 'Previous slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 3 of 18')
})

test('shows corporate and personal hands-on options with one shared sign-in requirement', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 4; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const slide = page.locator('.slide').nth(4)
  const card = slide.getByText('Complete it during the bootcamp', { exact: true }).locator('..')
  await expect(slide.getByText('JUST WATCH', { exact: true })).toBeVisible()
  await expect(slide.getByText('Complete it after the bootcamp', { exact: true })).toBeVisible()
  await expect(card.getByText('Choose one machine: corporate or personal.', { exact: true })).toBeVisible()
  const corporate = card.getByText('Corporate machine', { exact: true }).locator('..')
  const personal = card.getByText('Personal machine', { exact: true }).locator('..')
  await expect(corporate).toContainText("Install GitHub Copilot app with your company's permission, or use a virtual machine.")
  await expect(personal).toContainText('Install GitHub Copilot app.')
  const shared = card.getByText('Both:', { exact: true }).locator('..')
  await expect(card.getByText(/Sign in with your personal GitHub account/)).toHaveCount(1)
  await expect(shared).toContainText("Closer to the event, we'll share a link to connect your account to our bootcamp GitHub organization.")
  expect((await card.boundingBox()).height).toBeLessThan(page.viewportSize().width > 760 ? 360 : 560)
  await corporate.scrollIntoViewIfNeeded()
  const corporateBox = await corporate.boundingBox()
  const personalBox = await personal.boundingBox()
  if (page.viewportSize().width > 760) {
    expect(personalBox.x).toBeGreaterThan(corporateBox.x + corporateBox.width)
    expect(personalBox.y).toBeCloseTo(corporateBox.y, 0)
  } else {
    expect(personalBox.x).toBeCloseTo(corporateBox.x, 0)
    expect(personalBox.y).toBeGreaterThan(corporateBox.y + corporateBox.height)
  }
  expect((await shared.boundingBox()).y).toBeGreaterThan(personalBox.y + personalBox.height)
  await expect(slide.getByText('Watch the presenter build it live, ask questions, and take the materials home to try later.', { exact: true })).toBeVisible()
})

test('shows personal GitHub account and Copilot access guidance with their icons', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 5; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  await expect(page.locator('.slide').nth(5).locator('h3')).toHaveText([
    'GitHub account ready', 'GitHub Copilot access', 'GitHub Copilot app installed',
  ])
  await expect(page.getByText('GitHub CLI', { exact: true })).toHaveCount(0)
  const card = page.getByText('GitHub account ready', { exact: true }).locator('..')
  await card.scrollIntoViewIfNeeded()
  await expect(card).toContainText("Have a personal GitHub.com account ready that is not associated with your work. If you don't have one, you can create one for free at GitHub.com.")
  const logo = card.locator('img')
  await expect(logo).toBeVisible()
  await expect(logo).toHaveAttribute('src', /logos\/github-mark\.svg$/)
  expect(await logo.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true)
  const cardBox = await card.boundingBox()
  expect(cardBox.x).toBeGreaterThanOrEqual(0)
  expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(page.viewportSize().width)
  const copilotCard = page.getByText('GitHub Copilot access', { exact: true }).locator('..')
  await copilotCard.scrollIntoViewIfNeeded()
  await expect(copilotCard).toContainText("Closer to your selected session, we'll send you a link to join our bootcamp GitHub organization using your personal GitHub.com account. We'll provide GitHub Copilot access at no cost through the organization.")
  const copilotIcon = copilotCard.locator('img')
  await expect(copilotIcon).toBeVisible()
  await expect(copilotIcon).toHaveAttribute('src', /copilot-mascot\.png$/)
  expect(await copilotIcon.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true)
  const copilotBox = await copilotCard.boundingBox()
  expect(copilotBox.x).toBeGreaterThanOrEqual(0)
  expect(copilotBox.x + copilotBox.width).toBeLessThanOrEqual(page.viewportSize().width)
  const appCard = page.getByText('GitHub Copilot app installed', { exact: true }).locator('..')
  await appCard.scrollIntoViewIfNeeded()
  await expect(appCard).toContainText('Install the GitHub Copilot app wherever you can: on your corporate machine, in a virtual environment, or on your personal machine.')
  const appLink = appCard.getByRole('link', { name: 'GitHub Copilot app', exact: true })
  await expect(appLink).toHaveAttribute('href', 'https://docs.github.com/en/copilot/concepts/copilot-surfaces/github-copilot-app')
  await appLink.focus()
  await expect(appLink).toBeFocused()
  const appIcon = appCard.locator('img')
  await expect(appIcon).toBeVisible()
  await expect(appIcon).toHaveAttribute('src', /copilot-mascot\.png$/)
  expect(await appIcon.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true)
  const appBox = await appCard.boundingBox()
  expect(appBox.x).toBeGreaterThanOrEqual(0)
  expect(appBox.x + appBox.width).toBeLessThanOrEqual(page.viewportSize().width)
  await expect(page.getByText('Git installed', { exact: true })).toHaveCount(0)
})

test('introduces session descriptions without listing sessions', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 6; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const slide = page.locator('.slide').nth(6)
  await expect(slide.locator('h1')).toHaveText("What you'll learn")
  await expect(slide.getByText("The following slides describe each session and what you'll learn.", { exact: true })).toBeVisible()
  await expect(slide.getByText('The programme', { exact: true })).toBeVisible()
  await expect(slide.getByText('Foundations', { exact: true })).toHaveCount(0)
  await expect(slide.locator('b')).toHaveCount(0)
  await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 8 of 18')
})

test('presents the Copilot app session with the requested title and outcomes', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 7; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const slide = page.locator('.slide').nth(7)
  await expect(slide.locator('h1')).toHaveText('GitHub Copilot app')
  await expect(slide.getByText('Hands-on introduction', { exact: true })).toHaveCount(0)
  await expect(slide.getByText(/^A hands-on introduction to the GitHub Copilot app\./)).toBeVisible()
  await expect(slide.getByText('Navigate the app, manage sessions and context, and guide agents effectively.', { exact: true })).toHaveCount(0)
  await expect(slide.locator('li')).toHaveText([
    'Navigate the GitHub Copilot app and explore its core features.',
    'Try simple examples to better understand the app.',
  ])
  await expect(slide.getByText('Session focus', { exact: true })).toBeVisible()
  await expect(slide.getByText('Get ready to use the GitHub Copilot app in the upcoming bootcamp sessions.', { exact: true })).toBeVisible()
})

test('shows Plan and Design concepts without its removed subtitle', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 8; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const slide = page.locator('.slide').nth(8)
  await expect(slide.locator('h1')).toHaveText('Plan & Design')
  await expect(slide.getByText('Collaborative workshop', { exact: true })).toHaveCount(0)
  await expect(slide.getByText('Turn scattered input into clear requirements and a standards-aligned design.', { exact: true })).toHaveCount(0)
  const concepts = slide.getByText('Tools and concepts', { exact: true }).locator('..')
  await expect(concepts.locator('div > span')).toHaveText([
    'Requirements', 'Architecture', 'Engineering standards', 'Spec-driven-development',
  ])
  const added = concepts.getByText('Spec-driven-development', { exact: true })
  await added.scrollIntoViewIfNeeded()
  await expect(added).toBeVisible()
  const box = await added.boundingBox()
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width)
})

test('omits the Build and Test format label and subtitle', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 9; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const slide = page.locator('.slide').nth(9)
  await expect(slide.locator('h1')).toHaveText('Build & Test')
  await expect(slide.getByText('Hands-on build', { exact: true })).toHaveCount(0)
  await expect(slide.getByText('Steer implementation and testing from an agreed design and bounded scope.', { exact: true })).toHaveCount(0)
  await expect(slide.locator('li')).toHaveCount(3)
  await expect(slide.getByText('Session focus', { exact: true })).toBeVisible()
})

test('omits the Review Deploy and Operate format label and subtitle', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 10; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const slide = page.locator('.slide').nth(10)
  await expect(slide.locator('h1')).toHaveText('Review, Deploy & Operate')
  await expect(slide.getByText('Delivery workshop', { exact: true })).toHaveCount(0)
  await expect(slide.getByText('Review faster, deploy safely and use AI to investigate production issues.', { exact: true })).toHaveCount(0)
  await expect(slide.locator('li')).toHaveCount(3)
  await expect(slide.getByText('Session focus', { exact: true })).toBeVisible()
})

test('omits the Evaluations format label and subtitle', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 11; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const slide = page.locator('.slide').nth(11)
  await expect(slide.locator('h1')).toHaveText('Evaluations & Continuous Improvement')
  await expect(slide.getByText('Evaluation workshop', { exact: true })).toHaveCount(0)
  await expect(slide.getByText('Measure agentic workflows and improve quality, performance and cost.', { exact: true })).toHaveCount(0)
  await expect(slide.locator('li')).toHaveCount(3)
  await expect(slide.getByText('Session focus', { exact: true })).toBeVisible()
})

test('presents modernization as a bonus session requiring earlier sessions', async ({ page }) => {
  await page.goto('/#/deck')
  for (let index = 0; index < 12; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  const slide = page.locator('.slide').nth(12)
  await expect(slide.locator('h1')).toHaveText('AI-Native App Modernization')
  await expect(slide.getByText('Bonus session', { exact: true })).toHaveCount(0)
  await expect(slide.getByText('Prerequisite: Complete sessions 1–5', { exact: true })).toBeVisible()
  await expect(slide.getByText('Apply selected techniques from earlier sessions to modernize an existing application.', { exact: true })).toHaveCount(0)
  await expect(slide.getByText('In this bonus session, apply some of the techniques learned in earlier sessions to modernize an existing application. Completing sessions 1–5 is a prerequisite.', { exact: true })).toBeVisible()
  await expect(slide).not.toContainText(/capstone|full workflow|end-to-end|Bring everything|complete bootcamp/i)
  await expect(slide.locator('li')).toHaveCount(3)
})

test('uses the reference closing background only on the thank-you slide', async ({ page }) => {
  await page.goto('/#/deck')
  const slides = page.locator('.slide')
  for (let index = 0; index < 17; index += 1) {
    await expect(slides.nth(index)).not.toHaveCSS('background-image', /closing-bg/)
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 18 of 18')
  await expect(page.getByRole('button', { name: 'Next slide', exact: true })).toBeDisabled()
  const closing = slides.last()
  await expect(closing).toHaveCSS('background-image', /closing-bg[^"]*\.png/)
  expect(await closing.evaluate(async (element) => {
    const image = new Image()
    image.src = getComputedStyle(element).backgroundImage.match(/url\("([^"]+)"\)/)[1]
    await image.decode()
    return image.naturalWidth > 0
  })).toBe(true)
  await expect(closing.getByRole('heading', { name: 'See you this winter' })).toBeVisible()
  await expect(closing.getByText('Questions? Reach out to your Microsoft contact.')).toBeVisible()
  await expect(closing.locator('.mascot-copilot')).toBeVisible()
  await expect(page.locator('.snowfall')).toBeVisible()
})

test('scopes the warm reference palette to slides between the cover and thank-you', async ({ page }) => {
  await page.goto('/#/deck')
  const slides = page.locator('.slide')
  await expect(slides.first()).toHaveCSS('color', 'rgb(238, 246, 255)')
  await expect(slides.last()).toHaveCSS('color', 'rgb(238, 246, 255)')
  for (let index = 1; index < 17; index += 1) {
    await expect(slides.nth(index)).toHaveCSS('color', 'rgb(242, 236, 228)')
    await expect(slides.nth(index)).toHaveCSS('background-image', /rgb\(12, 10, 20\)/)
  }
  await expect(slides.first()).toHaveCSS('background-image', /cover-bg[^"]*\.png/)
  await expect(slides.last()).toHaveCSS('background-image', /closing-bg[^"]*\.png/)

  await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 2 of 18')
  await expect(slides.nth(1).locator('p').first()).toHaveCSS('color', 'rgb(212, 160, 106)')
  await expect(page.locator('.snowfall')).toBeVisible()
})

test('keeps the modernization mark consistent and respects reduced motion', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  const offering = page.locator('.slide').nth(1)
  await expect(offering.getByText('Practise the whole loop', { exact: true })).toBeVisible()
  await expect(offering.getByText('15 Jan – 19 Feb 2027', { exact: true })).toBeVisible()
  await expect(offering).not.toContainText(/preliminary/i)
  const mark = page.getByText('Modernize existing applications', { exact: true }).locator('..').locator('svg')
  const foundations = page.getByText('Start with the agent-native desktop experience', { exact: true }).locator('..').locator('svg')
  await expect(mark).toBeVisible()
  const size = await mark.boundingBox()
  const existingSize = await foundations.boundingBox()
  expect(size.width).toBeCloseTo(existingSize.width, 2)
  expect(size.height).toBeCloseTo(existingSize.height, 2)
  expect(await mark.locator('*').evaluateAll((elements) =>
    elements.some((element) => getComputedStyle(element).animationName !== 'none'),
  )).toBe(true)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await mark.locator('*').evaluateAll((elements) =>
    elements.every((element) => getComputedStyle(element).animationName === 'none'),
  )).toBe(true)
  await expect(mark).toBeVisible()
})

test('preserves query parameters when sending the main URL to the deck', async ({ page }) => {
  await page.goto('/?campaign=winter#/')
  await expect(page).toHaveURL('/?campaign=winter#/deck')
})

test('homepage CTA starts the slide tour instead of opening registration', async ({ page }) => {
  await page.goto('/')
  const note = page.getByText('Free · AI credits provided · Register on the final slide', { exact: true })
  await expect(note).toBeVisible()
  const noteBox = await note.boundingBox()
  expect(noteBox.x).toBeGreaterThanOrEqual(0)
  expect(noteBox.x + noteBox.width).toBeLessThanOrEqual(page.viewportSize().width)
  await expect(page.getByRole('button', { name: 'Previous slide', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Learn more and register', exact: true }).click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 2 of 18')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('iframe')).toHaveCount(0)
  await expect(page).toHaveURL(/#\/deck$/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 3 of 18')
})

test('shows mid-height arrows outside the slide content', async ({ page }) => {
  await page.goto('/')
  const viewport = page.viewportSize()
  const content = await page.locator('.slide').first().locator('.content-frame').evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return { left: bounds.left + parseFloat(style.paddingLeft), right: bounds.right - parseFloat(style.paddingRight) }
  })
  const previous = page.getByRole('button', { name: 'Previous slide', exact: true })
  const next = page.getByRole('button', { name: 'Next slide', exact: true })
  for (const arrow of [previous, next]) {
    await expect(arrow).toBeVisible()
    const box = await arrow.boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
    expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThanOrEqual(1)
    expect(box.x + box.width <= content.left || box.x >= content.right).toBe(true)
  }
  await next.click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 2 of 18')
  await previous.click()
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 1 of 18')
  await next.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 2 of 18')
  await previous.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.deck-navbar-count')).toHaveText('Slide 1 of 18')
})

test('keeps registration available on the registration slide', async ({ page }) => {
  // Verify our dialog and embed without depending on the external form service.
  await page.route('https://forms.cloud.microsoft/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<html><body>Registration form</body></html>' }))
  await page.goto('/')
  await expect(page.locator('iframe')).toHaveCount(0)
  for (let index = 0; index < 16; index += 1) {
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Register', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Bootcamp registration' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('iframe')).toHaveAttribute('src', /forms\.cloud\.microsoft\/.*embed=true/)
  await page.getByRole('button', { name: 'Close registration' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: 'Slide navigation' })).toBeVisible()
})
