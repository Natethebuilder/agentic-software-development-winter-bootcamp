import siteState from '../site-state.json'
import {
  effectiveRegistrationState, registrationFormEmbedUrl, registrationFormPageUrl,
} from './registration/microsoftForm.js'

// The public release states, set in site-state.json.
//
// registration
//   2  Registration will open soon. Every entry point shows an opening-soon state.
//   3  Registration is closed. Every entry point shows a closed state.
//   4  Registration is open through this bootcamp's Microsoft Form at "registrationFormUrl".
//      Every entry point leads to the form, embedded on the page. Without a valid form link the
//      site treats 4 as 3, and `vite build` fails.
//   Any other value, including 1 (the retired on-site form), is treated as closed.
//
// prerequisites
//   "ready"  Show the readiness checklist and guided setup.
//   "soon"   Replace prerequisites with a coming-soon panel.
export const REGISTRATION_STATE = effectiveRegistrationState(siteState)
export const REGISTRATION_OPEN = REGISTRATION_STATE === 4
export const REGISTRATION_FORM_URL = REGISTRATION_OPEN ? registrationFormPageUrl(siteState.registrationFormUrl) : ''
export const REGISTRATION_FORM_EMBED_URL = REGISTRATION_OPEN ? registrationFormEmbedUrl(siteState.registrationFormUrl) : ''
export const PREREQUISITES_STATE = siteState.prerequisites === 'soon' ? 'soon' : 'ready'
export const PREREQUISITES_OPEN = PREREQUISITES_STATE === 'ready'

// Picks the copy for the current registration state: open (the Microsoft Form), soon or closed.
export function byRegistrationState(open, soon, closed) {
  if (REGISTRATION_OPEN) return open
  return REGISTRATION_STATE === 2 ? soon : closed
}
