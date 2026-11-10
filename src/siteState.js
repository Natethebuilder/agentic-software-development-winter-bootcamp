import siteState from '../api/site-state.json'
import {
  effectiveRegistrationState, registrationFormEmbedUrl, registrationFormPageUrl,
} from './registration/microsoftForm.js'

// The public site and registration API share these release states.
//
// registration
//   1  Registration is open and the form submits to /api/register.
//   2  Registration will open soon. Every entry point shows an opening-soon state and
//      the API refuses submissions without removing the working form or flow.
//   3  Registration is closed. Every entry point shows a closed state and the API
//      refuses submissions.
//   4  Registration is open through this bootcamp's Microsoft Form at "registrationFormUrl".
//      Every entry point leads to the form, embedded on the page, and the API refuses
//      submissions. Without a valid form link the site treats 4 as 3, and `vite build` fails.
//   Any other value is treated as closed, here and in the API.
//
// prerequisites
//   "ready"  Show the readiness checklist and guided setup.
//   "soon"   Replace prerequisites with a coming-soon panel.
export const REGISTRATION_STATE = effectiveRegistrationState(siteState)
export const REGISTRATION_OPEN = REGISTRATION_STATE === 1 || REGISTRATION_STATE === 4
export const REGISTRATION_VIA_FORM = REGISTRATION_STATE === 4
export const REGISTRATION_FORM_URL = REGISTRATION_VIA_FORM ? registrationFormPageUrl(siteState.registrationFormUrl) : ''
export const REGISTRATION_FORM_EMBED_URL = REGISTRATION_VIA_FORM ? registrationFormEmbedUrl(siteState.registrationFormUrl) : ''
export const PREREQUISITES_STATE = siteState.prerequisites === 'soon' ? 'soon' : 'ready'
export const PREREQUISITES_OPEN = PREREQUISITES_STATE === 'ready'

// Picks the copy for the current registration state. The Microsoft Form (state 4) uses the open
// copy unless it needs its own.
export function byRegistrationState(open, soon, closed, form = open) {
  if (REGISTRATION_STATE === 1) return open
  if (REGISTRATION_STATE === 4) return form
  return REGISTRATION_STATE === 2 ? soon : closed
}
