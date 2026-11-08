import siteState from '../api/site-state.json'

// The public site and registration API share these release states.
//
// registration
//   1  Registration is open and the form submits to /api/register.
//   2  Registration will open soon. Every entry point shows an opening-soon state and
//      the API refuses submissions without removing the working form or flow.
//   3  Registration is closed. Every entry point shows a closed state and the API
//      refuses submissions.
//   Any other value is treated as closed, here and in the API.
//
// prerequisites
//   "ready"  Show the readiness checklist and guided setup.
//   "soon"   Replace prerequisites with a coming-soon panel.
export const REGISTRATION_STATE = [1, 2, 3].includes(siteState.registration) ? siteState.registration : 3
export const REGISTRATION_OPEN = REGISTRATION_STATE === 1
export const PREREQUISITES_STATE = siteState.prerequisites === 'soon' ? 'soon' : 'ready'
export const PREREQUISITES_OPEN = PREREQUISITES_STATE === 'ready'

// Picks the copy for the current registration state.
export function byRegistrationState(open, soon, closed) {
  if (REGISTRATION_STATE === 1) return open
  return REGISTRATION_STATE === 2 ? soon : closed
}
