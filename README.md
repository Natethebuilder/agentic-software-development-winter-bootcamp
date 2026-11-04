# Agentic Software Development Winter Bootcamp

Interactive public website and DECKIO presentation for a six-session community bootcamp about GitHub Copilot and agentic practices across the software development lifecycle.

**Live website:** https://jolly-field-07f1d0f0f.3.azurestaticapps.net/

| Route | Experience |
| --- | --- |
| `#/` | Public website with event framing, interactive programme workflow, development setup, FAQ and registration |
| `#/deck` | Horizontal DECKIO presentation with the same content and embedded registration |

The six session topics, descriptions and audiences are confirmed. The six Friday dates and daily times are preliminary: set `BOOTCAMP.datesConfirmed` to `true` in `src/content.js` once they are confirmed to remove the "preliminary" labels. Facilitators remain TBC.

All public copy lives in `src/content.js`, and the website and deck share it.

## Public release states

The website, deck and registration API share `api/site-state.json`.

| Setting | Value | Behaviour |
| --- | --- | --- |
| `registration` | `1` | Registration is open and submissions reach `/api/register` |
| `registration` | `2` | Registration entry points show “opening soon” and the API returns `403` |
| `prerequisites` | `"ready"` | Show the readiness checklist and guided setup |
| `prerequisites` | `"soon"` | Replace setup content with a coming-soon panel |

Change only this JSON file to move the public experience between states.

## Develop

```powershell
npm install
npm run dev
npm run build
npm run build:swa
```

The Azure Static Web Apps build uses `/` so the website, deck and `/api/register` share one origin.

## Registration architecture

The registration API:

1. validates company, matching email entries, the 36 allowed `YYYY-MM-DD|HH:MM|session-id` selections, environment and consent;
2. uses a browser-held opaque token to derive an event-scoped SHA-256 `RegistrationId`;
3. sends canonical company-email, session-selection and environment-preference fields without GitHub identity;
4. sends `eventId: agentic-software-development-winter-bootcamp` to the shared registration flow;
5. lets that flow route the submission into the dedicated Software Development SharePoint List and initialize its operational statuses.

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
