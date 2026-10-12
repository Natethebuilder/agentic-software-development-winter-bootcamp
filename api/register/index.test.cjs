const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const test = require('node:test')
const register = require('./index.js')

const registrationToken = '123e4567-e89b-42d3-a456-426614174000'
const sessionDates = ['2026-12-04', '2026-12-11', '2026-12-18', '2027-01-08', '2027-01-15', '2027-01-22']
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
    sessions: ['2026-12-04|09:15|session-01', '2027-01-22|14:45|session-06'],
    environment: 'cloud',
    consent: true,
  }
}

function configuredEnvironment() {
  process.env.REGISTRATION_FLOW_URL = 'https://flow.example.test/register'
  process.env.REGISTRATION_FLOW_SHARED_SECRET = 'test-only-secret'
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
  body.sessions = ['2026-12-04|09:15|session-01', '2026-12-04|09:15|session-01']
  await register(context, request(body))
  assert.equal(context.res.status, 400)
})

test('rejects invalid date, time, and session combinations', async (t) => {
  configuredEnvironment()
  const invalidSelections = [
    '2026-12-03|09:15|session-01',
    '2026-12-04|09:00|session-01',
    '2026-12-04|09:15|session-02',
    '2026-12-04|09:15|session-99',
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
  assert.equal(received.body.environmentPreference, 'cloud')
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
  assert.equal('registrationEmailKey' in context.res.body, false)
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
