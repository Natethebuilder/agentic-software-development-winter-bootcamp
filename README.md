# AI-Native Software Development Lifecycle Winter Bootcamp

Interactive DECKIO slide presentation for a six-session community bootcamp about GitHub Copilot and agentic practices across the software development lifecycle.

**Live website:** https://jolly-field-07f1d0f0f.3.azurestaticapps.net/

| Route | Experience |
| --- | --- |
| `/` and `#/` | Send visitors to the slide deck at the unchanged `#/deck` path |
| `#/deck` | Main slide presentation with event framing, programme, development setup, session details and registration |

The slide deck is the only public view; there is no Website mode or view switch.
The homepage's "Learn more and register" button advances to the next slide;
mid-height side arrows guide visitors through the deck. Registration remains available on the registration slide.
The former website-only FAQ, interactive programme reveal and saved setup checklist/guided wizard have been removed.

The six session topics, descriptions and audiences are confirmed. Session dates and daily times live in `src/content.js`; facilitators remain TBC.

Public copy lives in `src/content.js` and the slide components.

The opening slide uses `src/data/cover-bg.png` from the
[AI-native SDLC reference deck](https://github.com/karolmckgh/ai-native-sdlc-winter-bootcamp/blob/main/src/data/cover-bg.png),
with its cover crop and readability gradients. The animated snowfall remains layered above the deck.
The thank-you slide uses the same reference deck's `src/data/closing-bg.png`;
the slides between them use its warm amber and purple palette.

## Public release states

The slide presentation and registration API share `api/site-state.json`.

| Setting | Value | Behaviour |
| --- | --- | --- |
| `registration` | `1` | Registration is open and submissions reach `/api/register` |
| `registration` | `2` | Registration entry points show “opening soon” and the API returns `403` |
| `registration` | `3` | Registration is closed: entry points show a closed message, the form is hidden and the API returns `403` |
| `registration` | `4` | Registration is open through the bootcamp's Microsoft Form: entry points lead to the form, embedded on the page, and the API returns `403` |
| `registrationFormUrl` | `"https://forms.office.com/Pages/ResponsePage.aspx?id=<form id>"` | The Microsoft Form's response link, required for state `4` (`forms.cloud.microsoft` and `forms.microsoft.com` links also work) |
| `prerequisites` | `"ready"` | Show the readiness checklist and guided setup |
| `prerequisites` | `"soon"` | Replace setup content with a coming-soon panel |

Change only this JSON file to move the public experience between states. Any `registration` value other than `1`, `2`, `3` or `4` is treated as closed by both the site and the API, so a mistake never opens registration. State `4` without a valid `registrationFormUrl` also shows as closed, and the build fails so it can't deploy. The form itself is recorded in [docs/registration-form/README.md](docs/registration-form/README.md).

## Develop

```powershell
npm install
npm run dev
npm run build
npm run build:swa
```

Run registration checks with `npm test`. For desktop and mobile browser regression tests,
run `npx playwright install chromium` once, then `npm run test:browser`.

The Azure Static Web Apps build uses `/` so the presentation and `/api/register` share one origin.

## Registration architecture

In state `4`, registrations go to the bootcamp's Microsoft Form, and the API and flow below receive nothing. See [Registration through Microsoft Forms](docs/registration-backend.md#registration-through-microsoft-forms).

The registration API:

1. validates company, matching email entries, the 36 allowed `YYYY-MM-DD|HH:MM|session-id` selections and consent;
2. uses a browser-held opaque token to derive an event-scoped SHA-256 `RegistrationId`;
3. sends canonical company-email and session-selection fields, plus the fixed `local` environment preference the shared flow requires and the consent wording version from `api/consent-version.json`, without GitHub identity;
4. sends `eventId: agentic-software-development-winter-bootcamp` to the shared registration flow;
5. lets that flow route the submission into the dedicated Software Development SharePoint List and initialize its operational statuses;
6. gives new and already registered email addresses the same confirmation, so the response never reveals whether an address is registered.

A few days before the event, the attendee receives an invitation containing the link to join the event GitHub organization. GitHub Copilot AI credits are provided in the event environment.

The application uses:

| Setting | Purpose |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Existing shared Data Winter Bootcamp registration flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Server-side secret validated by the shared flow |

Never commit either value. See [docs/registration-backend.md](docs/registration-backend.md).

## Deploy

Pushing to `main` deploys the complete application to Azure Static Web Apps:

- Resource group: `rg-agentic-software-development-winter-bootcamp`
- Static Web App: `swa-agentic-software-development-winter-bootcamp`
- Workflow: `.github/workflows/deploy-registration.yml`
