# Registration backend

This event uses one self-contained Azure Static Web App for the public website, DECKIO deck, GitHub authentication and protected registration API. The API forwards validated registrations to a dedicated Power Automate flow that deterministically upserts into a restricted Microsoft List.

No secret, trigger URL or registration record belongs in the repository.

## Dedicated SharePoint operations site

Create a **private** SharePoint team site named:

`Agentic Software Development Winter Bootcamp Operations`

Suggested URL slug:

`agentic-software-development-winter-ops`

Grant access only to the event operations team. Do not add broad organisation-wide visitor groups. Apply the organisation's data retention and event administration policies before accepting registrations.

## Microsoft List

Create a List named:

`Agentic Software Development Winter Bootcamp Registrations`

Use these columns:

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `Title` | Single line of text | Yes | Verified GitHub username |
| `EventId` | Single line of text | Yes | Fixed value `ASDWB-2026` |
| `RegistrationId` | Single line of text | Yes | Unique and indexed; event-scoped HMAC from the API |
| `GitHubUserId` | Single line of text | Yes | Static Web Apps provider identifier |
| `GitHubUsername` | Single line of text | Yes | Verified GitHub handle |
| `Organisation` | Single line of text | Yes | Maximum 160 characters |
| `CompanyEmail` | Single line of text | Yes | Lower-case email address |
| `Sessions` | Multiple lines of text | Yes | JSON array or semicolon-delimited session IDs |
| `Environment` | Choice | Yes | `browser`, `local` or `either` |
| `Consent` | Yes/No | Yes | Must be `Yes` |
| `UpdatedAt` | Date and time | Yes | ISO timestamp supplied by the API |

Index `EventId` and `RegistrationId`. Turn on version history. Do not expose the List publicly. Define and document a deletion date after the event administration period.

## Power Automate deterministic upsert

Create an automated cloud flow named:

`ASDWB Registration Deterministic Upsert`

Use **When an HTTP request is received** with this schema:

```json
{
  "type": "object",
  "required": [
    "eventId",
    "registrationId",
    "githubUserId",
    "githubUsername",
    "organisation",
    "email",
    "sessions",
    "environment",
    "consent",
    "updatedAt"
  ],
  "properties": {
    "eventId": { "type": "string", "const": "ASDWB-2026" },
    "registrationId": { "type": "string" },
    "githubUserId": { "type": "string" },
    "githubUsername": { "type": "string" },
    "organisation": { "type": "string" },
    "email": { "type": "string" },
    "sessions": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["session-01", "session-02", "session-03", "session-04", "session-05", "session-06"]
      }
    },
    "environment": {
      "type": "string",
      "enum": ["browser", "local", "either"]
    },
    "consent": { "type": "boolean" },
    "updatedAt": { "type": "string" }
  }
}
```

Flow steps:

1. Compare the `x-software-development-registration-secret` request header with a secret stored only in the flow and Azure Static Web Apps. Reject a mismatch with HTTP `401`.
2. Reject the request with HTTP `400` unless `eventId` equals `ASDWB-2026` and `consent` is `true`.
3. Use **Get items** with the filter query `EventId eq 'ASDWB-2026' and RegistrationId eq '<registrationId>'` and top count `1`.
4. If one row exists, update that exact List item. Otherwise, create a new row.
5. Map `Title` to `githubUsername`, `CompanyEmail` to `email`, and serialize `sessions` consistently.
6. Return HTTP `202` with a minimal body such as `{ "ok": true }`.

The API's event-scoped HMAC means repeat submissions from the same GitHub identity always target the same row without exposing a reusable cross-event identifier.

Do not log request bodies, email addresses, trigger URLs or secrets. Restrict flow ownership to the operations team and apply an appropriate run-history retention policy.

## Azure Static Web Apps

Suggested resource name:

`swa-agentic-software-development-winter`

Deployment secret in GitHub:

| Name | Purpose |
| --- | --- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_SOFTWARE_DEVELOPMENT_BOOTCAMP` | Dedicated deployment token for this Static Web App |

Application settings in Azure Static Web Apps:

| Name | Required | Purpose |
| --- | --- | --- |
| `SOFTWARE_DEVELOPMENT_REGISTRATION_FLOW_URL` | Yes | HTTPS Power Automate trigger URL |
| `SOFTWARE_DEVELOPMENT_REGISTRATION_FLOW_SHARED_SECRET` | Yes | Random value validated with the request header |
| `SOFTWARE_DEVELOPMENT_REGISTRATION_ID_SALT` | Yes | Independent random value used only for event-scoped HMAC IDs |

Generate the two random values independently. Never reuse values from another bootcamp or expose them in GitHub Actions logs.

GitHub authentication uses `/.auth/login/github`. The browser reads the verified principal from `/.auth/me`; the API independently requires the platform-provided `x-ms-client-principal` header and ignores browser-supplied identity fields.

## Verification

1. Open the Azure-hosted site in a private browser and confirm unauthenticated registration redirects to GitHub sign-in.
2. Confirm a request without the platform principal is rejected.
3. Sign in with GitHub and verify the displayed handle.
4. Submit a registration and confirm exactly one List item is created.
5. Change the selected sessions and submit again; confirm the same item is updated and `UpdatedAt` advances.
6. Send an invalid flow secret directly to the flow; confirm HTTP `401` and no List change.
7. Confirm browser responses, Function logs and flow run history do not expose secrets or unnecessary personal data.

