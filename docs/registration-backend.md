# Software Development registration backend

The public form uses the shared multi-event Power Automate flow and a dedicated private SharePoint List. GitHub OAuth and GitHub identity are not used for registration.

## SharePoint target

- Site: `https://microsofteur.sharepoint.com/teams/AgenticSoftwareDevelopmentWinterBootcamp`
- List: `Agentic Software Development Bootcamp Registrations`
- List ID: `33add272-6226-4ee7-9430-440fd7e7612d`
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
| `Environment` | Choice | `local` or `cloud` |
| `OrganizationAccessStatus` | Choice | `Pending`, `Invitation queued`, `Invitation sent`, `Joined`, or `Issue` |
| `CloudEnvironmentStatus` | Choice | `Not requested`, `Requested`, `Allocated`, `Ready`, `Waitlisted`, or `Issue` |
| `Consent` | Yes/No | Explicit data consent |
| `UpdatedAt` | Date and time | Latest submitted timestamp |

`GitHubUserId` and `GitHubUsername` are obsolete and should not exist in the final schema.

## Registration identity

The attendee enters the company email twice. The browser and API normalize both values and reject the submission unless they match.

The first accepted response returns an opaque UUID token stored in the browser. The API derives:

```text
SHA256("agentic-software-development-winter-bootcamp:" + registrationToken)
```

This lets the same browser update the same row without using the email address as an authentication credential.

The API also derives a downstream-only email deduplication key from the normalized company email:

```text
SHA256("agentic-software-development-winter-bootcamp:" + normalizedCompanyEmail)
```

The browser cannot submit or override `registrationEmailKey`, and the API never returns it to the browser. It exists only in the server-to-server Power Automate payload.

## API payload

The public placeholder schedule uses these six Fridays:

- `2026-12-04`
- `2026-12-11`
- `2026-12-18`
- `2027-01-08`
- `2027-01-15`
- `2027-01-22`

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
    "2026-12-04|09:15|session-01",
    "2027-01-22|14:45|session-06"
  ],
  "environmentPreference": "cloud",
  "consent": true,
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

The shared flow temporarily accepts `email`, `sessions`, and `environment` as aliases during deployment migration. New clients use only the canonical fields above.

## Shared flow behavior

The shared `Agentic Winter Bootcamps Registration Upsert` flow must be updated and verified before this contract is considered deployed:

1. Invalid shared secrets return HTTP `401`.
2. `agentic-software-development-winter-bootcamp` routes only to this List.
3. Missing or unrecognized event IDs return HTTP `400`.
4. Configure the HTTP trigger concurrency control to `runs: 1`. Serial processing prevents simultaneous anonymous submissions from both passing the duplicate check before either create completes.
5. `Get_software_items` temporarily queries for either `Title eq '<registrationEmailKey>'` or `CompanyEmail eq '<normalizedCompanyEmail>'`, with top count `1`. The hashed `Title` is the canonical deduplication key; the email fallback supports legacy rows without a manual backfill.
6. The branch updates the first matching row or creates one when absent.
7. Creates store the email hash in `Title`, the normalized address in `CompanyEmail`, and the token-derived `RegistrationId`; they initialize `OrganizationAccessStatus` to `Pending`.
8. Creates set `CloudEnvironmentStatus` to `Requested` for cloud or `Not requested` for local.
9. Updates keep the stored `CompanyEmail` immutable. A submitted email is used only to derive the lookup key and must not replace the address already stored on the matched item.
10. When the legacy fallback matched `CompanyEmail`, migrate `Title` to `registrationEmailKey` only when both the submitted normalized email and token-derived `RegistrationId` match the stored row. This valid same-token/same-email update performs the cutover lazily without a manual SharePoint backfill.
11. When `Company` changes, reset `OrganizationAccessStatus` to `Pending` if the current status reflects an approval or invitation decision that must be reviewed for the new company.
12. When `Environment` changes, reset `CloudEnvironmentStatus` to `Requested` for cloud or `Not requested` for local so provisioning reflects the new choice.
13. Updates that do not change company or environment preserve both operational status fields.
14. Enable secure inputs and secure outputs on the HTTP trigger and every action carrying registration data or secrets. Apply the approved flow run-history retention policy.
15. Accepted registrations return HTTP `202`.

The flow writes filterable `SessionSelections` and the temporary `Sessions` text copy. Configure the List choice field with all 36 canonical values before accepting these placeholder registrations.

## Operational view

Prioritize `CompanyEmail`, `Company`, `SessionSelections`, `Environment`, both status columns, `Consent`, and `UpdatedAt`. Hide `Title`, `RegistrationId`, and `Sessions` from the default view where practical.

## Azure Static Web Apps

| Setting | Purpose |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Shared flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Server-side secret validated by the flow |

Do not expose either value in source, documentation, browser responses, or logs.

## GitHub organization access

A few days before the event, the invitation provides the link for joining the event GitHub organization. The event environment includes $100 worth of GitHub Copilot AI credits.

## Verification

- The public site and registration API do not require GitHub sign-in.
- The disabled GitHub OAuth route returns `404`.
- Registration tests validate email confirmation, all 36 canonical choices, invalid date/time/session combinations, backend settings, and the canonical payload.
- Registration tests validate deterministic normalized email-key derivation and prove browser-supplied key overrides are ignored.
- Test submissions require explicit approval because they create or update SharePoint data.
- A create should initialize the two operational status fields.
- A repeat submission from the same browser should retain its token-derived `RegistrationId`.
- A submission using the same normalized email from another browser should match the hashed `Title` row without replacing `CompanyEmail`.
- A valid same-token/same-email update to a legacy row should replace its email-valued `Title` with the hash; mismatched tokens must not trigger that migration.
- Concurrent duplicate-submission testing should confirm trigger concurrency `runs: 1` prevents duplicate creates.
- Flow run history should mask secure inputs and outputs for registration-bearing actions.
- Company and environment changes should reset only the relevant downstream operational status as described above.
