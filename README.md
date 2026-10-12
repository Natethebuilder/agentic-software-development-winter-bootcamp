# Agentic Software Development Winter Bootcamp

Interactive public website and DECKIO presentation for a six-session community bootcamp about GitHub Copilot and agentic practices across the software development lifecycle.

**Live website:** https://jolly-field-07f1d0f0f.3.azurestaticapps.net/

| Route | Experience |
| --- | --- |
| `#/` | Public website with event framing, programme placeholders, development setup, FAQ and registration |
| `#/deck` | Horizontal DECKIO presentation with the same content and embedded registration |

Topics, dates, speakers and headshots intentionally remain visible placeholders until the programme is confirmed.

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

1. validates company, matching email entries, session IDs, environment and consent;
2. uses a browser-held opaque token to derive an event-scoped SHA-256 `RegistrationId`;
3. sends legacy GitHub fields as explicit `not-collected` compatibility markers;
4. sends `eventId: agentic-software-development-winter-bootcamp` to the shared registration flow;
5. lets that flow route the submission into the dedicated Software Development SharePoint List.

A few days before the event, the attendee receives a Golden Ticket invitation containing the link to join the event GitHub organization. The environment includes $100 worth of GitHub Copilot AI credits.

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
