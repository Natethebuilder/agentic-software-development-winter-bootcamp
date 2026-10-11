# Agentic Software Development Winter Bootcamp

One React, Vite and DECKIO application for the public event website and presentation deck for the broader software development community.

| Route | Experience |
| --- | --- |
| `#/` | Public website, six-session placeholder programme, interactive agentic SDLC and registration |
| `#/deck` | Presentation deck driven by the same content model |

## Local development

```powershell
npm install
npm run dev
npm run build
```

The Azure Static Web Apps build uses `npm run build:swa` so the website, deck, GitHub authentication and registration API share one origin.

## Content placeholders

Dates, topics, speakers and headshots are intentionally marked `TBC`. Update the six entries in `src/content.js` when the programme is confirmed; both the website and deck update together.

## Registration architecture

Registration uses Azure Static Web Apps GitHub authentication and a protected `/api/register` function. The function validates the verified platform identity, generates an event-scoped deterministic registration ID and forwards only validated fields to a dedicated Power Automate flow for upsert into a private Microsoft List.

See [`docs/registration-backend.md`](docs/registration-backend.md) for the private SharePoint operations site, List schema, flow contract, application settings and verification checklist.

## Deployment

The workflow at `.github/workflows/deploy-registration.yml` deploys to a dedicated Azure Static Web App after these repository settings exist:

| Setting | Purpose |
| --- | --- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_SOFTWARE_DEVELOPMENT_BOOTCAMP` | Deployment token stored as a GitHub Actions secret |
| `SOFTWARE_DEVELOPMENT_REGISTRATION_FLOW_URL` | Power Automate trigger URL stored as an Azure app setting |
| `SOFTWARE_DEVELOPMENT_REGISTRATION_FLOW_SHARED_SECRET` | Required shared secret stored only in Azure and Power Automate |

Suggested Azure resource name: `swa-agentic-software-development-winter`.
