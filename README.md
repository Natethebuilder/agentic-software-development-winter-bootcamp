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

The Azure Static Web Apps build uses `/` so the website, deck, GitHub authentication and `/api/register` share one origin.

## Registration architecture

The protected API:

1. reads the authenticated GitHub identity from `x-ms-client-principal`;
2. validates company, email, session IDs, environment and consent;
3. derives an event-scoped SHA-256 `RegistrationId`;
4. sends `eventId: agentic-software-development-winter-bootcamp` to the shared registration flow;
5. lets that flow route the submission into the dedicated Software Development SharePoint List.

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
