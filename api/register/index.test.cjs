const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const test = require('node:test')
const register = require('./index.js')
const siteState = require('../site-state.json')
const { consentVersion } = require('../consent-version.json')

// Keep normal tests independent from the state committed for the live site.
siteState.registration = 1

// The site, the deck and the build share these checks for registration state 4 (src is ES modules).
const microsoftForm = () => import('../../src/registration/microsoftForm.js')
const FORM_URL = 'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__hYqKRhUQ1ZBWkdHQTc5Ti4u'
const MOVED = 'Registration has moved to a new form. Refresh this page to register.'

const registrationToken = '123e4567-e89b-42d3-a456-426614174000'
const sessionDates = ['2027-01-15', '2027-01-22', '2027-01-29', '2027-02-05', '2027-02-12', '2027-02-19']
const sessionTimes = {
  'session-01': '09:15',
  'session-02': '10:15',
  'session-03': '11:15',
  'session-04': '12:45',
  'session-05': '13:45',
  'session-06': '14:45',
}
const allSlots = sessionDates.flatMap((date) => (
  Object.entries(sessionTimes).map(([session, time]) => `${date}|${time}|${session}`)
))

function request(body) {
  return { headers: {}, body }
}

function validBody() {
  return {
    company: 'Example Org',
    email: 'Builder@Example.com',
    emailConfirmation: 'builder@example.com',
    registrationToken,
    sessions: ['2027-01-15|09:15|session-01', '2027-02-19|14:45|session-06'],
    consent: true,
  }
}

function configuredEnvironment() {
  process.env.REGISTRATION_FLOW_URL = 'https://flow.example.test/register'
  process.env.REGISTRATION_FLOW_SHARED_SECRET = 'test-only-secret'
}

function flowReply(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  }
}

test('rejects mismatched email confirmation', async () => {
  configuredEnvironment()
  const context = {}
  const body = validBody()
  body.emailConfirmation = 'different@example.com'
  await register(context, request(body))
  assert.equal(context.res.status, 400)
})

test('rejects duplicate date and session slots', async () => {
  configuredEnvironment()
  const context = {}
  const body = validBody()
  body.sessions = ['2027-01-15|09:15|session-01', '2027-01-15|09:15|session-01']
  await register(context, request(body))
  assert.equal(context.res.status, 400)
})

test('rejects invalid date, time, and session combinations', async (t) => {
  configuredEnvironment()
  const invalidSelections = [
    '2027-01-14|09:15|session-01',
    '2026-12-04|09:15|session-01',
    '2027-01-15|09:00|session-01',
    '2027-01-15|09:15|session-02',
    '2027-01-15|09:15|session-99',
    'session-01',
  ]

  for (const selection of invalidSelections) {
    await t.test(selection, async () => {
      const context = {}
      const body = validBody()
      body.sessions = [selection]
      await register(context, request(body))
      assert.equal(context.res.status, 400)
    })
  }
})

test('requires data consent', async () => {
  configuredEnvironment()
  let called = false
  global.fetch = async () => {
    called = true
    return { ok: true }
  }

  const context = {}
  const body = validBody()
  body.consent = false
  await register(context, request(body))

  assert.equal(context.res.status, 400)
  assert.equal(called, false)
})

test('refuses registrations while registration is paused', async () => {
  configuredEnvironment()
  let called = false
  global.fetch = async () => {
    called = true
    return { ok: true }
  }

  const original = siteState.registration
  siteState.registration = 2
  try {
    const context = {}
    await register(context, request(validBody()))
    assert.equal(context.res.status, 403)
    assert.equal(context.res.body.error, 'Registration will open soon.')
    assert.equal(called, false)
  } finally {
    siteState.registration = original
  }
})

test('requires shared backend settings', async () => {
  delete process.env.REGISTRATION_FLOW_URL
  delete process.env.REGISTRATION_FLOW_SHARED_SECRET
  const context = {}
  await register(context, request(validBody()))
  assert.equal(context.res.status, 503)
})

test('forwards an anonymous event-routed upsert payload', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (url, options) => {
    received = { url, options, body: JSON.parse(options.body) }
    return { ok: true }
  }

  const context = {}
  await register(context, request(validBody()))

  assert.equal(context.res.status, 202)
  assert.equal(String(received.url), 'https://flow.example.test/register')
  assert.equal(received.options.headers['x-registration-secret'], 'test-only-secret')
  assert.equal(received.body.eventId, 'agentic-software-development-winter-bootcamp')
  assert.equal(received.body.companyEmail, 'builder@example.com')
  assert.equal(
    received.body.registrationEmailKey,
    createHash('sha256').update('agentic-software-development-winter-bootcamp:builder@example.com').digest('hex'),
  )
  assert.deepEqual(received.body.sessionSelections, validBody().sessions)
  assert.equal(received.body.environmentPreference, 'local')
  assert.equal(received.body.consentVersion, consentVersion)
  assert.equal('githubUserId' in received.body, false)
  assert.equal('githubUsername' in received.body, false)
  assert.equal('email' in received.body, false)
  assert.equal('sessions' in received.body, false)
  assert.equal('environment' in received.body, false)
  assert.equal(
    received.body.registrationId,
    createHash('sha256').update(`agentic-software-development-winter-bootcamp:${registrationToken}`).digest('hex'),
  )
  assert.equal(context.res.body.registrationToken, registrationToken)
  assert.equal(context.res.body.outcome, 'received')
  assert.equal('registrationEmailKey' in context.res.body, false)
})

test('gives a slow flow time to answer within the 45 s Static Web Apps limit', async () => {
  configuredEnvironment()
  const timeout = AbortSignal.timeout
  let timeoutMs
  AbortSignal.timeout = (ms) => {
    timeoutMs = ms
    return timeout.call(AbortSignal, ms)
  }
  global.fetch = async () => ({ ok: true })

  const context = {}
  try {
    await register(context, request(validBody()))
  } finally {
    AbortSignal.timeout = timeout
  }

  assert.equal(context.res.status, 202)
  assert.ok(timeoutMs >= 20_000)
  assert.ok(timeoutMs < 45_000)
})

test('reports an updated registration when the flow updated the saved record', async () => {
  configuredEnvironment()
  global.fetch = async () => flowReply(202, { ok: true, outcome: 'updated' })

  const context = {}
  await register(context, request(validBody()))

  assert.equal(context.res.status, 202)
  assert.deepEqual(context.res.body, { ok: true, outcome: 'updated', registrationToken })
})

test('answers new and already registered email addresses identically', async (t) => {
  configuredEnvironment()
  const replies = {
    created: () => flowReply(202, { ok: true, outcome: 'created' }),
    unchanged: () => flowReply(202, { ok: true, outcome: 'unchanged' }),
    'missing outcome': () => flowReply(202, { ok: true }),
    'empty body': () => flowReply(202, ''),
    'non-JSON body': () => flowReply(202, 'Accepted'),
    'JSON null body': () => flowReply(202, 'null'),
    'unknown outcome': () => flowReply(202, { ok: true, outcome: 'something-new' }),
    'unreadable body': () => ({ ok: true, status: 202, text: async () => { throw new Error('aborted') } }),
    'no body reader': () => ({ ok: true, status: 202 }),
  }

  for (const [label, reply] of Object.entries(replies)) {
    await t.test(label, async () => {
      global.fetch = async () => reply()
      const context = {}
      await register(context, request(validBody()))
      assert.equal(context.res.status, 202)
      assert.deepEqual(context.res.body, { ok: true, outcome: 'received', registrationToken })
    })
  }
})

test('returns a token for a new registration without a stored token', async () => {
  configuredEnvironment()
  global.fetch = async () => flowReply(202, { ok: true, outcome: 'unchanged' })

  const context = {}
  const body = validBody()
  delete body.registrationToken
  await register(context, request(body))

  assert.equal(context.res.status, 202)
  assert.equal(context.res.body.outcome, 'received')
  assert.match(context.res.body.registrationToken, /^[0-9a-f-]{36}$/)
})

test('maps a flow email mismatch to 409 without returning a token', async (t) => {
  configuredEnvironment()
  const replies = {
    'email-mismatch body': () => flowReply(409, { ok: false, outcome: 'email-mismatch' }),
    'empty body': () => flowReply(409, ''),
  }

  for (const [label, reply] of Object.entries(replies)) {
    await t.test(label, async () => {
      global.fetch = async () => reply()
      const context = {}
      await register(context, request(validBody()))
      assert.equal(context.res.status, 409)
      assert.deepEqual(context.res.body, {
        error: 'This email address doesn\u2019t match the registration saved in this browser. Check the address, or choose "Not you? Start a new registration".',
        code: 'registration-email-mismatch',
      })
      assert.equal('registrationToken' in context.res.body, false)
    })
  }
})

test('reports other flow failures as 502', async (t) => {
  configuredEnvironment()
  for (const status of [400, 401, 404, 500]) {
    await t.test(String(status), async () => {
      global.fetch = async () => flowReply(status, { ok: false })
      const context = {}
      await register(context, request(validBody()))
      assert.equal(context.res.status, 502)
      assert.equal(context.res.body.error, 'Registration storage rejected the request.')
      assert.equal('registrationToken' in context.res.body, false)
    })
  }
})

test('sends the server-side consent version and ignores a browser value', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (_url, options) => {
    received = JSON.parse(options.body)
    return flowReply(202, { ok: true, outcome: 'created' })
  }

  const body = validBody()
  body.consentVersion = 'browser-supplied-version'
  await register({}, request(body))

  assert.match(consentVersion, /^\d{4}-\d{2}-\d{2}$/)
  assert.equal(received.consentVersion, consentVersion)
})

test('documents the consent wording for the current consent version', () => {
  const root = join(__dirname, '..', '..')
  const content = readFileSync(join(root, 'src', 'content.js'), 'utf8')
  const docs = readFileSync(join(root, 'docs', 'registration-backend.md'), 'utf8')
  const wording = content.match(/\bconsent:\s*'([^']+)'/)?.[1]
  const row = docs.split(/\r?\n/).find((line) => line.startsWith(`| \`${consentVersion}\` |`))

  assert.ok(wording, 'src/content.js has no REGISTRATION.consent wording')
  assert.ok(row, `docs/registration-backend.md has no consent wording row for ${consentVersion}`)
  assert.ok(
    row.includes(wording),
    'The consent wording changed. Add a new version to api/consent-version.json and the docs table.',
  )
})

test('accepts registrations only while registration is open', async (t) => {
  configuredEnvironment()
  const original = siteState.registration
  const states = [
    [1, 202],
    [2, 403, 'Registration will open soon.'],
    [3, 403, 'Registration is closed.'],
    [0, 403, 'Registration is not open.'],
    [4, 403, MOVED],
    [5, 403, 'Registration is not open.'],
    ['1', 403, 'Registration is not open.'],
    ['4', 403, 'Registration is not open.'],
    [true, 403, 'Registration is not open.'],
    [null, 403, 'Registration is not open.'],
    [undefined, 403, 'Registration is not open.'],
  ]

  try {
    for (const [state, status, error] of states) {
      await t.test(`state ${state === undefined ? 'missing' : JSON.stringify(state)}`, async () => {
        let called = false
        global.fetch = async () => {
          called = true
          return flowReply(202, { ok: true, outcome: 'created' })
        }
        siteState.registration = state
        const context = {}
        await register(context, request(validBody()))
        assert.equal(context.res.status, status)
        assert.equal(called, status === 202)
        if (error) assert.deepEqual(context.res.body, { error })
      })
    }
  } finally {
    siteState.registration = original
  }
})

test('state 4 sends visitors to the new form without calling the flow', async () => {
  configuredEnvironment()
  let calls = 0
  global.fetch = async () => {
    calls += 1
    return flowReply(202, { ok: true, outcome: 'created' })
  }
  const original = siteState.registration
  try {
    siteState.registration = 4
    const context = {}
    await register(context, request(validBody()))
    assert.equal(context.res.status, 403)
    assert.equal(context.res.headers['Cache-Control'], 'no-store')
    assert.deepEqual(context.res.body, { error: MOVED })
    assert.equal(calls, 0)
  } finally {
    siteState.registration = original
  }
})

test('accepts only Microsoft Forms response pages as the registration form', async () => {
  const { isRegistrationFormUrl } = await microsoftForm()
  const accepted = [
    FORM_URL,
    'https://forms.office.com/Pages/ResponsePage.aspx?id=abc123',
    'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=abc123',
    'https://forms.microsoft.com/Pages/ResponsePage.aspx?id=abc123',
    'https://FORMS.Office.com/Pages/ResponsePage.aspx?id=abc123',
    'https://forms.office.com/Pages/ResponsePage.aspx?id=abc123&embed=true',
    'https://forms.office.com/Pages/ResponsePage.aspx?origin=lprLink&id=abc123',
  ]
  for (const url of accepted) assert.equal(isRegistrationFormUrl(url), true, url)

  const rejected = [
    '',
    undefined,
    null,
    4,
    { href: FORM_URL },
    'forms.office.com/Pages/ResponsePage.aspx?id=abc123',
    'http://forms.office.com/Pages/ResponsePage.aspx?id=abc123',
    'https://forms.office.com.example.com/Pages/ResponsePage.aspx?id=abc123',
    'https://evilforms.office.com/Pages/ResponsePage.aspx?id=abc123',
    'https://eu.forms.office.com/Pages/ResponsePage.aspx?id=abc123',
    'https://forms.example.com/Pages/ResponsePage.aspx?id=abc123',
    'https://forms.office.com:8443/Pages/ResponsePage.aspx?id=abc123',
    'https://registrant@forms.office.com/Pages/ResponsePage.aspx?id=abc123',
    'https://forms.office.com/Pages/ResponsePage.aspx/?id=abc123',
    'https://forms.office.com/Pages/DesignPageV2.aspx?id=abc123',
    'https://forms.office.com/r/abc123',
    'https://forms.office.com/Pages/ResponsePage.aspx',
    'https://forms.office.com/Pages/ResponsePage.aspx?id=',
    'https://forms.office.com/Pages/ResponsePage.aspx?id=%20%20',
    'https://forms.office.com/Pages/ResponsePage.aspx?form=abc123',
    ` ${FORM_URL}`,
    `${FORM_URL}\n`,
  ]
  for (const value of rejected) assert.equal(isRegistrationFormUrl(value), false, JSON.stringify(value))
})

test('embeds the registration form with embed=true', async () => {
  const { registrationFormEmbedUrl } = await microsoftForm()
  assert.equal(registrationFormEmbedUrl(FORM_URL), `${FORM_URL}&embed=true`)
  assert.equal(registrationFormEmbedUrl(`${FORM_URL}&embed=true`), `${FORM_URL}&embed=true`)
  assert.equal(registrationFormEmbedUrl(`${FORM_URL}&embed=false`), `${FORM_URL}&embed=true`)
})

test('opens the registration form in a new tab without the embedded layout', async () => {
  const { registrationFormPageUrl } = await microsoftForm()
  assert.equal(registrationFormPageUrl(FORM_URL), FORM_URL)
  assert.equal(registrationFormPageUrl(`${FORM_URL}&embed=true`), FORM_URL)
  assert.equal(
    registrationFormPageUrl('https://forms.office.com/Pages/ResponsePage.aspx?embed=true&id=abc123&origin=lprLink'),
    'https://forms.office.com/Pages/ResponsePage.aspx?id=abc123&origin=lprLink',
  )
})

test('state 4 shows as closed without a valid form link', async () => {
  const { effectiveRegistrationState } = await microsoftForm()
  for (const registration of [1, 2, 3]) {
    assert.equal(effectiveRegistrationState({ registration, registrationFormUrl: '' }), registration)
  }
  assert.equal(effectiveRegistrationState({ registration: 4, registrationFormUrl: FORM_URL }), 4)
  assert.equal(effectiveRegistrationState({ registration: 4, registrationFormUrl: '' }), 3)
  assert.equal(effectiveRegistrationState({ registration: 4 }), 3)
  assert.equal(effectiveRegistrationState({ registration: 4, registrationFormUrl: 'https://example.com/register' }), 3)
  for (const registration of [0, 5, '1', '4', null, undefined]) {
    assert.equal(effectiveRegistrationState({ registration, registrationFormUrl: FORM_URL }), 3, `state ${registration}`)
  }
  assert.equal(effectiveRegistrationState(undefined), 3)
})

test('the build stops when state 4 has no valid form link', async () => {
  const { registrationFormBuildError } = await microsoftForm()
  for (const registrationFormUrl of ['', undefined, 'https://example.com/register', 'https://forms.office.com/r/abc123']) {
    const error = registrationFormBuildError({ registration: 4, registrationFormUrl })
    assert.match(error, /"registration": 4/)
    assert.match(error, /registrationFormUrl/)
    assert.match(error, /https:\/\/forms\.office\.com\/Pages\/ResponsePage\.aspx\?id=<form id>/)
  }
  assert.equal(registrationFormBuildError({ registration: 4, registrationFormUrl: FORM_URL }), '')
  for (const registration of [1, 2, 3, 5, '4', undefined]) {
    assert.equal(registrationFormBuildError({ registration, registrationFormUrl: '' }), '', `state ${registration}`)
  }
})

test('the committed site state is valid for a deploy', async () => {
  const { registrationFormBuildError } = await microsoftForm()
  const committed = JSON.parse(readFileSync(join(__dirname, '..', 'site-state.json'), 'utf8'))
  assert.ok([1, 2, 3, 4].includes(committed.registration), `registration ${JSON.stringify(committed.registration)}`)
  assert.equal(registrationFormBuildError(committed), '')
})

test('always forwards the local environment preference', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (_url, options) => {
    received = JSON.parse(options.body)
    return { ok: true }
  }

  const context = {}
  const body = validBody()
  body.environment = 'cloud'
  body.environmentPreference = 'cloud'
  await register(context, request(body))

  assert.equal(context.res.status, 202)
  assert.equal(received.environmentPreference, 'local')
  assert.equal('environment' in received, false)
})

test('normalizes the downstream email key deterministically', async () => {
  configuredEnvironment()
  const keys = []
  global.fetch = async (_url, options) => {
    keys.push(JSON.parse(options.body).registrationEmailKey)
    return { ok: true }
  }

  const first = validBody()
  first.email = '  Builder@Example.COM '
  first.emailConfirmation = 'builder@example.com'
  await register({}, request(first))

  const second = validBody()
  second.email = 'builder@example.com'
  second.emailConfirmation = ' BUILDER@EXAMPLE.COM '
  await register({}, request(second))

  const expected = createHash('sha256')
    .update('agentic-software-development-winter-bootcamp:builder@example.com')
    .digest('hex')
  assert.deepEqual(keys, [expected, expected])
})

test('ignores caller-supplied email and registration key overrides', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (_url, options) => {
    received = JSON.parse(options.body)
    return { ok: true }
  }

  const body = validBody()
  body.registrationEmailKey = 'caller-controlled-email-key'
  body.registrationId = 'caller-controlled-registration-id'
  await register({}, request(body))

  assert.equal(
    received.registrationEmailKey,
    createHash('sha256').update('agentic-software-development-winter-bootcamp:builder@example.com').digest('hex'),
  )
  assert.equal(
    received.registrationId,
    createHash('sha256').update(`agentic-software-development-winter-bootcamp:${registrationToken}`).digest('hex'),
  )
})

test('accepts and forwards all 36 canonical placeholder choices', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (_url, options) => {
    received = JSON.parse(options.body)
    return { ok: true }
  }

  const context = {}
  const body = validBody()
  body.sessions = allSlots
  await register(context, request(body))

  assert.equal(context.res.status, 202)
  assert.equal(allSlots.length, 36)
  assert.deepEqual(received.sessionSelections, allSlots)
})
