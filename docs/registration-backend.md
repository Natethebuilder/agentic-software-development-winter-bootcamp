# Software Development registration backend

The public form uses the shared multi-event Power Automate flow and a dedicated private SharePoint List. GitHub OAuth and GitHub identity are not used for registration. In site state `4`, registration moves to the bootcamp's Microsoft Form instead, and this backend receives nothing; see [Registration through Microsoft Forms](#registration-through-microsoft-forms).

## Registration states

Registration availability is controlled by `registration` in `api/site-state.json`, which both the public site and the API read.

| Value | State | Public site | API |
| --- | --- | --- | --- |
| `1` | Open | Shows the registration form | Accepts submissions |
| `2` | Opening soon | Shows “Registration will open soon” wherever registration appears. The form and backend stay in place for opening. | `403` “Registration will open soon.” |
| `3` | Closed | Shows “Registration is closed” and no form | `403` “Registration is closed.” |
| `4` | Open through Microsoft Forms | Every registration entry point leads to the bootcamp's Microsoft Form at `registrationFormUrl`, embedded on the page | `403` “Registration has moved to a new form. Refresh this page to register.” |
| Any other value | Closed | Same as `3` | `403` “Registration is not open.” |

Unknown values fail closed, so a mistake in `api/site-state.json` can never open registration. State `4` without a valid `registrationFormUrl` also shows as closed, and `npm run build` fails so it can't deploy.

## Registration through Microsoft Forms

In state `4`, the bootcamp's own Microsoft Form captures registrations. Responses stay with the form owner in Microsoft Forms and Excel, not in the SharePoint List, and the Power Automate flow is not used. The site's form, `/api/register` and the flow stay in place, so switching back to `1` restores them. [registration-form/README.md](registration-form/README.md) records the form's questions, settings and design so it can be rebuilt, and lists what Microsoft Forms does not check, such as matching email entries.

To switch to state `4`, set `"registration": 4` and set `"registrationFormUrl"` to the form's response link, then commit and push to `main`. The link must:

- use `https`;
- be on `forms.office.com`, `forms.cloud.microsoft` or `forms.microsoft.com`;
- use the path `/Pages/ResponsePage.aspx`;
- include a non-empty `id` query parameter, as in `https://forms.office.com/Pages/ResponsePage.aspx?id=<form id>`.

Short `/r/` share links are not accepted: open one and copy the address it leads to, or take the `src` from the form's embed code. The site adds `embed=true` for the embedded form and removes it from the new-tab link. The form must accept responses from anyone, because attendees come from many organisations. The content security policy in `public/staticwebapp.config.json` allows frames from the three Forms hosts only.

- **Website**: the registration section lists what the form asks for and loads the form in a frame only when the visitor chooses **Start registration**, so nothing is requested from Microsoft Forms before then. An **Open the form in a new tab** link is always shown. Microsoft Forms renders inside a frame only when the frame is at least 320 pixels wide, so on phones the frame spans the full width of the card.
- **Deck**: the registration dialog shows the form straight away, because opening the dialog is already the visitor's choice.
- **API**: `/api/register` refuses submissions with HTTP `403` before validation, without calling the flow. A visitor with an old copy of the page who submits the site's form is asked to refresh and reaches the Microsoft Form.

## SharePoint target

- Site: the bootcamp's private SharePoint operations site. Its URL and the List ID are kept out of this repository.
- List: `Agentic Software Development Bootcamp Registrations`
- Privacy: private
- Permissions: inherited from the operations site
- Sensitivity: `Confidential \ Internal-Only`
- Version history: enabled, 50 versions

| Column | Type | Purpose |
| --- | --- | --- |
| `Title` | Single line of text | Receives the event-scoped `registrationEmailKey` hash for new and migrated rows |
| `RegistrationId` | Single line of text | Unique, indexed event-scoped identifier |
| `Company` | Single line of text | Company or organisation |
| `CompanyEmail` | Single line of text | Normalized communication address |
| `SessionSelections` | Choice, multiple selections | The 36 canonical placeholder date-time-session choices described below |
| `Sessions` | Multiple lines of text | Temporary semicolon-delimited compatibility copy |
| `Environment` | Choice | `local` or `cloud`; this event always submits `local` |
| `OrganizationAccessStatus` | Choice | `Pending`, `Invitation queued`, `Invitation sent`, `Joined`, or `Issue` |
| `CloudEnvironmentStatus` | Choice | `Not requested`, `Requested`, `Allocated`, `Ready`, `Waitlisted`, or `Issue`; new rows for this event stay `Not requested` |
| `Consent` | Yes/No | Explicit data consent |
| `ConsentVersion` | Single line of text | Version of the consent wording the attendee agreed to, see [Consent wording versions](#consent-wording-versions). Empty on rows last saved before versions were sent |
| `UpdatedAt` | Date and time | Latest submitted timestamp |

`GitHubUserId` and `GitHubUsername` are obsolete and should not exist in the final schema.

## Registration identity

The attendee enters the company email twice. The browser and API normalize both values and reject the submission unless they match.

The first accepted response returns an opaque UUID token, which the browser keeps in `localStorage`. It is the only registration data the browser stores. The API derives:

```text
SHA256("agentic-software-development-winter-bootcamp:" + registrationToken)
```

The flow finds registrations by this `RegistrationId`, so only the browser holding the token can update a registration, and only with the email address it was saved with. The email address is never used as an authentication credential.

Whenever the browser holds a token, the form shows “Not you? Start a new registration”. It deletes the token and resets the form, so on a shared device the next person starts a new registration instead of being matched to the previous person's.

The API also derives a downstream-only email deduplication key from the normalized company email:

```text
SHA256("agentic-software-development-winter-bootcamp:" + normalizedCompanyEmail)
```

The browser cannot submit or override `registrationEmailKey`, and the API never returns it to the browser. It exists only in the server-to-server Power Automate payload.

## API payload

The public placeholder schedule uses these six Fridays:

- `2027-01-15`
- `2027-01-22`
- `2027-01-29`
- `2027-02-05`
- `2027-02-12`
- `2027-02-19`

Each date offers the same six session slots:

| Session | Placeholder time |
| --- | --- |
| `session-01` | `09:15` |
| `session-02` | `10:15` |
| `session-03` | `11:15` |
| `session-04` | `12:45` |
| `session-05` | `13:45` |
| `session-06` | `14:45` |

The canonical stored selection format is:

```text
YYYY-MM-DD|HH:MM|session-id
```

The API allowlist is the Cartesian product of the six dates and six session/time mappings: exactly 36 valid values. The dates and times are placeholders for workflow validation and remain publicly labelled TBC.

```json
{
  "eventId": "agentic-software-development-winter-bootcamp",
  "registrationId": "event-scoped SHA-256 value",
  "registrationEmailKey": "event-scoped normalized-email SHA-256 value",
  "company": "Example organisation",
  "companyEmail": "person@example.com",
  "sessionSelections": [
    "2027-01-15|09:15|session-01",
    "2027-02-19|14:45|session-06"
  ],
  "environmentPreference": "local",
  "consent": true,
  "consentVersion": "2026-11-04",
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

`environmentPreference` is always `local`. Registration does not offer a cloud development environment, but the shared flow still requires the field, so the API sends this fixed value and ignores any environment value from the browser. Rows submitted while the cloud option was still on the form keep `cloud` until the attendee updates their registration.

`consentVersion` identifies the consent wording shown on the form. The API always takes it from `api/consent-version.json` and ignores any value from the browser. See [Consent wording versions](#consent-wording-versions).

The flow's trigger schema sets `additionalProperties: false`, so it rejects any field not shown above, including the retired `email`, `sessions` and `environment` aliases. `consentVersion` is optional in the schema (a string of 1 to 40 characters), but this API always sends it.

## Shared flow behavior

The deployed shared `Agentic Winter Bootcamps Registration Upsert` flow:

1. Invalid shared secrets return HTTP `401`.
2. `agentic-software-development-winter-bootcamp` routes only to this List.
3. Missing or unrecognized event IDs return HTTP `400`.
4. It looks up the item whose `RegistrationId` equals the submitted `registrationId`.
5. If that item exists and its stored `CompanyEmail` equals the submitted `companyEmail` (case-insensitive), it updates the item and returns HTTP `202` with `{"ok":true,"outcome":"updated"}`. The update keeps the stored `CompanyEmail`, sets `Title` to `registrationEmailKey` (replacing the email address that older rows may still hold there), and writes the submitted `consentVersion`, keeping the stored value when none is sent.
6. If that item exists but its stored email differs, it writes nothing and returns HTTP `409` with `{"ok":false,"outcome":"email-mismatch"}`.
7. If no item has that `RegistrationId`, it checks whether the email address is already registered: an item whose `Title` equals `registrationEmailKey`, or whose `CompanyEmail` equals the normalized address. If one exists, it writes nothing and returns HTTP `202` with `{"ok":true,"outcome":"unchanged"}`.
8. Otherwise it creates an item and returns HTTP `202` with `{"ok":true,"outcome":"created"}`. Creates store the email hash in `Title`, the normalized address in `CompanyEmail`, the token-derived `RegistrationId` and the submitted `consentVersion` (empty when none is sent), and initialize `OrganizationAccessStatus` to `Pending`.
9. Creates set `CloudEnvironmentStatus` to `Requested` for cloud or `Not requested` for local.
10. When an update changes `Company`, reset `OrganizationAccessStatus` to `Pending` if the current status reflects an approval or invitation decision that must be reviewed for the new company.
11. When an update changes `Environment`, reset `CloudEnvironmentStatus` to `Requested` for cloud or `Not requested` for local so provisioning reflects the new choice.
12. Updates that do not change company or environment preserve both operational status fields.
13. Keep the HTTP trigger in synchronous response mode. The `400`, `401`, `409` and `202` Response actions run only after the relevant validation and the SharePoint lookup, create or update complete, so the caller never receives success before persistence.
14. Enable secure inputs and secure outputs on the HTTP trigger and every action carrying registration data or secrets. Apply the approved flow run-history retention policy.

The flow writes filterable `SessionSelections` and the temporary `Sessions` text copy. Configure the List choice field with all 36 canonical values before accepting these placeholder registrations.

## API responses

`api/register` waits up to 30 seconds for the flow (`FLOW_TIMEOUT_MS`). Production flow responses sometimes take 9 to 10 seconds because of a platform start delay, and 30 seconds stays under the 45-second Static Web Apps API limit.

The API answers the browser as follows. A new email address and an already registered one get the same response, including a token, so the response never shows whether an address is registered.

| Flow answer | API response | Form shows |
| --- | --- | --- |
| `202` with `created` or `unchanged`, or with no readable `outcome` | `202` `{"ok":true,"outcome":"received","registrationToken":"…"}` | `REGISTRATION.received`: “Thanks, we’ve received your registration. If this email address was already registered, your original registration is unchanged. To change it, contact the Microsoft contact who invited you. GitHub organization access details will be sent a few days before the event.” |
| `202` with `updated` | `202` `{"ok":true,"outcome":"updated","registrationToken":"…"}` | `REGISTRATION.updated`: “Thanks. Your registration has been updated. GitHub organization access details will be sent a few days before the event.” |
| `409` | `409` `{"error":"…","code":"registration-email-mismatch"}`, with no token | The API error: “This email address doesn’t match the registration saved in this browser. Check the address, or choose "Not you? Start a new registration".” The browser keeps its token. |
| Any other status, a timeout or a network error | `502` with an error message | The API error |

## Consent wording versions

The consent wording is `REGISTRATION.consent` in `src/content.js`. Its version is the date that wording went live on the public site (`YYYY-MM-DD`), kept in `api/consent-version.json`. The API sends it as `consentVersion` with every registration, and the flow stores it in `ConsentVersion`.

To change the wording:

1. Update `REGISTRATION.consent` in `src/content.js`.
2. Set `consentVersion` in `api/consent-version.json` to the date the new wording goes live.
3. Add a row for the new version to this table and keep the existing rows.

`npm test` fails when this table has no row for the current version, or when that row's wording differs from the form.

| Version | Live from | File | Exact wording |
| --- | --- | --- | --- |
| `2026-11-04` | 2026-11-04 (deployed 16:56 UTC) | `src/content.js` (`REGISTRATION.consent`) | I consent to Microsoft using my company, company email and session choices to administer the bootcamp, send the GitHub organization invitation, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period. |

Rows last saved before the API sent `consentVersion` have an empty `ConsentVersion`. Their `UpdatedAt` shows when the attendee last gave consent: the wording above applies from its live time, and the wording shown earlier is in the git history of `src/content.js`.

## Operational view

Prioritize `CompanyEmail`, `Company`, `SessionSelections`, `OrganizationAccessStatus`, `Consent`, and `UpdatedAt`. Hide `Title`, `RegistrationId`, and `Sessions` from the default view where practical. `Environment` and `CloudEnvironmentStatus` can be hidden too, because new registrations are always `local` and `Not requested`.

## Azure Static Web Apps

| Setting | Purpose |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Shared flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Server-side secret validated by the flow |

Do not expose either value in source, documentation, browser responses, or logs.

## GitHub organization access

A few days before the event, the invitation provides the link for joining the event GitHub organization. GitHub Copilot AI credits are provided in the event environment.

## Verification

- The public site and registration API do not require GitHub sign-in.
- The disabled GitHub OAuth route returns `404`.
- Registration tests validate email confirmation, data consent, all 36 canonical choices, invalid date/time/session combinations, backend settings, the canonical payload with the server-side `consentVersion`, and the fixed `local` environment preference.
- Registration tests validate deterministic normalized email-key derivation and prove browser-supplied key overrides are ignored.
- Registration tests check that only state `1` accepts submissions, the 30-second flow timeout, the mapping in [API responses](#api-responses), and that the consent wording table matches the form.
- Registration tests check the state `4` refusal, which form links are accepted, the embedded and new-tab links, that state `4` without a valid link shows as closed and stops the build, and that the committed `api/site-state.json` can deploy.
- Test submissions require explicit approval because they create or update SharePoint data.
- A create should initialize the two operational status fields and store `ConsentVersion`.
- A repeat submission from the same browser with the same email should update the same item and answer `updated`.
- A submission from the same browser with a different email should write nothing and answer `409`.
- A submission of an already registered email from another browser, or after “Not you? Start a new registration”, should write nothing, leave the stored row unchanged and get the same response as a new registration.
- A same-token, same-email update to a legacy row should replace its email-valued `Title` with the hash. A mismatched email must not write anything.
- Response-path testing should confirm `400`, `401` and `409` failures, and that `202` is returned only after the SharePoint lookup, create or update completes.
- Flow run history should mask secure inputs and outputs for registration-bearing actions.
- Company changes should reset only `OrganizationAccessStatus`. Updating a row that was submitted with `cloud` should reset `CloudEnvironmentStatus` to `Not requested`.
