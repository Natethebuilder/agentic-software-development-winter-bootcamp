# AI-Native Software Development Lifecycle Winter Bootcamp

Interactive DECKIO slide presentation for a six-session community bootcamp about GitHub Copilot and agentic practices across the software development lifecycle.

**Live website:** https://natethebuilder.github.io/agentic-software-development-winter-bootcamp/

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

The slide presentation reads `site-state.json`.

| Setting | Value | Behaviour |
| --- | --- | --- |
| `registration` | `2` | Registration entry points show “opening soon” |
| `registration` | `3` | Registration is closed: entry points show a closed message |
| `registration` | `4` | Registration is open through the bootcamp's Microsoft Form: entry points lead to the form, embedded on the page |
| `registrationFormUrl` | `"https://forms.office.com/Pages/ResponsePage.aspx?id=<form id>"` | The Microsoft Form's response link, required for state `4` (`forms.cloud.microsoft` and `forms.microsoft.com` links also work) |
| `prerequisites` | `"ready"` | Show the readiness checklist and guided setup |
| `prerequisites` | `"soon"` | Replace setup content with a coming-soon panel |

Change only this JSON file to move the public experience between states. Any `registration` value other than `2`, `3` or `4` is treated as closed, including `1`, the retired on-site form, so a mistake never opens registration. State `4` without a valid `registrationFormUrl` also shows as closed, and the build fails so it can't deploy.

## Registration through Microsoft Forms

Registrations go to the bootcamp's Microsoft Form, and responses stay with the form owner in Microsoft Forms and Excel. [docs/registration-form/README.md](docs/registration-form/README.md) records the form's questions, settings and design so it can be rebuilt.

`registrationFormUrl` must be the form's full response link:

- `https`, on `forms.office.com`, `forms.cloud.microsoft` or `forms.microsoft.com`;
- the path `/Pages/ResponsePage.aspx` with a non-empty `id`, as in `https://forms.office.com/Pages/ResponsePage.aspx?id=<form id>`.

Short `/r/` share links are not accepted: open one and copy the address it leads to, or take the `src` from the form's embed code. The site adds `embed=true` for the embedded form and removes it from the "Open the form in a new tab" link. The form must accept responses from anyone, because attendees come from many organisations.

The registration slide's dialog loads the form straight away, because opening the dialog is already the visitor's choice. Microsoft Forms renders inside a frame only when the frame is at least 320 pixels wide, so on phones the frame spans the full width of the dialog.

A few days before the event, the attendee receives an invitation containing the link to join the event GitHub organization. GitHub Copilot AI credits are provided in the event environment.

Registrations made through the retired on-site form are in the `Agentic Software Development Bootcamp Registrations` SharePoint List. Its setup and the shared Power Automate flow are described in `docs/registration-backend.md` in the git history.

## Privacy

The site follows Microsoft's website privacy guidance:

- **Footer links on every slide**: Your Privacy Choices, Consumer Health Privacy and Privacy (the Microsoft Privacy Statement), with the exact link text and `go.microsoft.com` links in `PRIVACY_LINKS` in `src/content.js`. On phones, where slides scroll, the links close each slide's content. Your Privacy Choices shows the unmodified opt-out icon from microsoft.com's footer, `public/ccpa-opt-out.svg`, with the alt text "California Consumer Privacy Act (CCPA) Opt-Out Icon".
- **Registration**: above the embedded form, the registration dialog says why the form collects personal data and links the Privacy Statement. [docs/registration-form/README.md](docs/registration-form/README.md#privacy-and-data-retention) covers the form's required questions and when responses are deleted.
- **No cookies**: the site sets no cookies and has no analytics, ads, pixels or third-party trackers, and Inter is served from the site, so it needs no cookie banner or "Manage cookies" link. The registration dialog loads Microsoft Forms only after the visitor selects Register. The site keeps only these values, in session storage, which the browser deletes when the tab closes:

| Key | Purpose | Set |
| --- | --- | --- |
| `slide:agentic-software-development-winter-bootcamp` | Reopens the current slide after a reload (deck engine) | On load and on every slide change |
| `deck-navbar-dismissed` | Keeps the slide navigation hidden after the visitor hides it | When the visitor selects Hide |

Adding a cookie, analytics, ads or any other third-party script needs a privacy review first, and optional cookies also need a cookie banner and a "Manage cookies" footer link.

## Develop

```powershell
npm install
npm run dev
npm test
npm run build
```

`npm test` checks the Microsoft Forms link rules and that the committed `site-state.json` can deploy. For desktop and mobile browser regression tests,
run `npx playwright install chromium` once, then `npm run test:browser`.

## Deploy

Pushing to `main` builds the site and publishes it to GitHub Pages with `.github/workflows/deploy.yml`. The workflow sets `BASE_PATH` to the Pages path, `/agentic-software-development-winter-bootcamp/`; local builds use `/`.

GitHub Pages can't send response headers, so the build adds the content security policy and referrer policy to the page as meta tags (`securityPolicy()` in `vite.config.js`). The policy allows frames from the three Microsoft Forms hosts only and allows the page's inline scripts by hash. A meta tag can't set `frame-ancestors`, `X-Frame-Options`, `X-Content-Type-Options` or `Permissions-Policy`, so the site no longer sends them.
