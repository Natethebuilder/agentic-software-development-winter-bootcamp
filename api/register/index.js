const { createHash, randomUUID } = require('node:crypto')
const siteState = require('../site-state.json')
// Version of the consent wording in src/content.js (REGISTRATION.consent). When that wording
// changes, update this file and the consent wording versions table in docs/registration-backend.md.
const { consentVersion: CONSENT_VERSION } = require('../consent-version.json')

const EVENT_ID = 'agentic-software-development-winter-bootcamp'
const SESSION_DATES = ['2027-01-15', '2027-01-22', '2027-01-29', '2027-02-05', '2027-02-12', '2027-02-19']
const SESSION_TIMES = {
  'session-01': '09:15',
  'session-02': '10:15',
  'session-03': '11:15',
  'session-04': '12:45',
  'session-05': '13:45',
  'session-06': '14:45',
}
const SESSION_IDS = new Set(
  SESSION_DATES.flatMap((date) => Object.entries(SESSION_TIMES).map(([session, time]) => `${date}|${time}|${session}`)),
)
// The shared registration flow requires an environment preference. This bootcamp has
// no cloud option, so the API always sends local and ignores any browser value.
const ENVIRONMENT_PREFERENCE = 'local'
const REGISTRATION_TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
// Power Automate can take several seconds just to accept a request, so wait well beyond its
// usual 1-3 s while staying under the 45 s Static Web Apps API request limit.
const FLOW_TIMEOUT_MS = 30_000
const EMAIL_MISMATCH_ERROR =
  'This email address doesn\u2019t match the registration saved in this browser. Check the address, or choose "Not you? Start a new registration".'

// Registration states in api/site-state.json: 1 open, 2 opening soon, 3 closed, 4 open through
// the bootcamp's Microsoft Form. Only state 1 accepts registrations here; any other value fails
// closed. State 4 tells visitors with a cached page where to go.
function registrationNotOpenMessage(state) {
  if (state === 2) return 'Registration will open soon.'
  if (state === 3) return 'Registration is closed.'
  if (state === 4) return 'Registration has moved to a new form. Refresh this page to register.'
  return 'Registration is not open.'
}

// The flow answers 202 with { outcome: 'created' | 'updated' | 'unchanged' }. Older flow
// versions send no outcome, so anything unreadable is treated like a new registration.
async function readFlowOutcome(flowResponse) {
  if (typeof flowResponse.text !== 'function') return ''
  try {
    const parsed = JSON.parse(await flowResponse.text())
    return parsed && typeof parsed.outcome === 'string' ? parsed.outcome.trim().toLowerCase() : ''
  } catch {
    return ''
  }
}

function response(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body,
  }
}

module.exports = async function register(context, req) {
  if (siteState.registration !== 1) {
    context.res = response(403, { error: registrationNotOpenMessage(siteState.registration) })
    return
  }

  const body = req.body || {}
  const company = typeof body.company === 'string' ? body.company.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const emailConfirmation = typeof body.emailConfirmation === 'string' ? body.emailConfirmation.trim().toLowerCase() : ''
  const suppliedToken = typeof body.registrationToken === 'string' ? body.registrationToken.trim() : ''
  const requestedSessions = Array.isArray(body.sessions) ? body.sessions : []
  const sessions = [...new Set(requestedSessions.filter((id) => SESSION_IDS.has(id)))]

  if (!company || company.length > 160) {
    context.res = response(400, { error: 'Enter a valid company or organisation.' })
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    context.res = response(400, { error: 'Enter a valid company email address.' })
    return
  }
  if (email !== emailConfirmation) {
    context.res = response(400, { error: 'The company email addresses must match.' })
    return
  }
  if (suppliedToken && !REGISTRATION_TOKEN.test(suppliedToken)) {
    context.res = response(400, { error: 'The registration session is invalid. Refresh the page and try again.' })
    return
  }
  if (!sessions.length || sessions.length !== requestedSessions.length) {
    context.res = response(400, { error: 'Choose at least one valid date and session time.' })
    return
  }
  if (body.consent !== true) {
    context.res = response(400, { error: 'Provide data consent to register.' })
    return
  }

  const flowUrl = process.env.REGISTRATION_FLOW_URL
  const flowSecret = process.env.REGISTRATION_FLOW_SHARED_SECRET
  if (!flowUrl || !flowSecret) {
    context.res = response(503, { error: 'Registration storage is not configured yet.' })
    return
  }

  let parsedFlowUrl
  try {
    parsedFlowUrl = new URL(flowUrl)
  } catch {
    context.res = response(503, { error: 'Registration storage is not configured correctly.' })
    return
  }
  if (parsedFlowUrl.protocol !== 'https:') {
    context.res = response(503, { error: 'Registration storage requires a secure endpoint.' })
    return
  }

  const registrationToken = suppliedToken || randomUUID()
  const registrationId = createHash('sha256').update(`${EVENT_ID}:${registrationToken}`).digest('hex')
  const registrationEmailKey = createHash('sha256').update(`${EVENT_ID}:${email}`).digest('hex')
  const payload = {
    eventId: EVENT_ID,
    registrationId,
    registrationEmailKey,
    company,
    companyEmail: email,
    sessionSelections: sessions,
    environmentPreference: ENVIRONMENT_PREFERENCE,
    consent: true,
    consentVersion: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }

  let flowResponse
  try {
    flowResponse = await fetch(parsedFlowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-registration-secret': flowSecret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(FLOW_TIMEOUT_MS),
    })
  } catch {
    context.res = response(502, { error: 'Registration storage is temporarily unavailable.' })
    return
  }

  // The token in this browser belongs to a registration saved with a different email address.
  if (flowResponse.status === 409) {
    context.res = response(409, { error: EMAIL_MISMATCH_ERROR, code: 'registration-email-mismatch' })
    return
  }
  if (!flowResponse.ok) {
    context.res = response(502, { error: 'Registration storage rejected the request.' })
    return
  }

  // Created and unchanged get the same answer so the response never reveals whether an
  // email address is already registered.
  const outcome = (await readFlowOutcome(flowResponse)) === 'updated' ? 'updated' : 'received'
  context.res = response(202, { ok: true, outcome, registrationToken })
}
