import siteState from '../api/site-state.json'

// The public site and registration API share these release states.
//
// registration
//   1  Registration is open and the form submits to /api/register.
//   2  Registration is paused. Every entry point shows an opening-soon state and
//      the API refuses submissions without removing the working form or flow.
//
// prerequisites
//   "ready"  Show the readiness checklist and guided setup.
//   "soon"   Replace prerequisites with a coming-soon panel.
export const REGISTRATION_STATE = siteState.registration === 2 ? 2 : 1
export const REGISTRATION_OPEN = REGISTRATION_STATE === 1
export const PREREQUISITES_STATE = siteState.prerequisites === 'soon' ? 'soon' : 'ready'
export const PREREQUISITES_OPEN = PREREQUISITES_STATE === 'ready'
