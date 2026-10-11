# Registration backend

The Agentic Software Development Winter Bootcamp uses one Azure Static Web App for the website, `#/deck` presentation, GitHub authentication and protected registration API. The API forwards validated registrations to a dedicated Power Automate flow that deterministically upserts into a restricted Microsoft List.

No secret, trigger URL or registration record belongs in the repository.

## Dedicated SharePoint operations site

Create a **private** SharePoint site with this title:

`Agentic Software Development Winter Bootcamp`

Use this site path:

`AgenticSoftwareDevelopmentWinterBootcamp`

Keep the site's inherited permissions private and grant access only to the event operations team.

## Microsoft List

Create this List in the private operations site:

`Agentic Software Development Bootcamp Registrations`

Use the proven registration schema exactly:

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `Title` | Single line of text | Yes | Verified GitHub username |
| `RegistrationId` | Single line of text | Yes | Unique and indexed; SHA-256 identifier supplied by the API |
| `GitHubUserId` | Single line of text | Yes | Static Web Apps application-scoped provider identifier |
| `GitHubUsername` | Single line of text | Yes | Verified GitHub handle |
| `Company` | Single line of text | Yes | Maximum 160 characters |
| `CompanyEmail` | Single line of text | Yes | Lower-case email address |
| `Sessions` | Multiple lines of text | Yes | JSON array or a consistently delimited list of session IDs |
| `Environment` | Choice | Yes | `local` or `cloud` |
| `Consent` | Yes/No | Yes | Must be `Yes` |
| `UpdatedAt` | Date and time | Yes | ISO timestamp supplied by the API |

Set `RegistrationId` to enforce unique values and add an index. Enable version history and retain **50 versions**. Keep inherited private-site permissions; do not share the List separately or publicly.

## Power Automate deterministic upsert

Create an automated cloud flow named:

`Agentic Software Development Winter Bootcamp Registration Upsert`

Use **When an HTTP request is received** with this strict schema:

```json
{
  "type": "object",
  "required": [
    "registrationId",
    "githubUserId",
    "githubUsername",
    "company",
    "email",
    "sessions",
    "environment",
    "consent",
    "updatedAt"
  ],
  "additionalProperties": false,
  "properties": {
    "registrationId": {
      "type": "string",
      "pattern": "^[a-f0-9]{64}$"
    },
    "githubUserId": { "type": "string" },
    "githubUsername": { "type": "string" },
    "company": {
      "type": "string",
      "maxLength": 160
    },
    "email": {
      "type": "string",
      "maxLength": 254
    },
    "sessions": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string",
        "enum": ["session-01", "session-02", "session-03", "session-04", "session-05", "session-06"]
      }
    },
    "environment": {
      "type": "string",
      "enum": ["local", "cloud"]
    },
    "consent": {
      "type": "boolean",
      "const": true
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

Flow steps:

1. Compare the `x-registration-secret` request header with the flow's copy of `REGISTRATION_FLOW_SHARED_SECRET`. Return HTTP `401` immediately if it does not match.
2. Use **Get items** on `Agentic Software Development Bootcamp Registrations` with filter query `RegistrationId eq '<registrationId>'` and top count `1`.
3. Add a condition using the returned array length: `length(body('Get_items')?['value'])` is greater than `0`.
4. In the **Yes** branch, update the first returned item.
5. In the **No** branch, create a new item.
6. Map every field in both branches:
   - `Title` ← `githubUsername`
   - `RegistrationId` ← `registrationId`
   - `GitHubUserId` ← `githubUserId`
   - `GitHubUsername` ← `githubUsername`
   - `Company` ← `company`
   - `CompanyEmail` ← `email`
   - `Sessions` ← consistently serialized `sessions`
   - `Environment` ← `environment`
   - `Consent` ← `consent`
   - `UpdatedAt` ← `updatedAt`
7. Return HTTP `202` with a minimal body such as `{ "ok": true }`.

A repeat submission from the same Static Web Apps application-scoped GitHub user ID produces the same SHA-256 `RegistrationId`, leaves one row in the List and advances `UpdatedAt`.

Do not log request bodies, email addresses, trigger URLs or secrets. Restrict flow ownership to the operations team and apply the organisation's registration-data retention policy.

## Azure Static Web Apps

Resource group:

`rg-agentic-software-development-winter-bootcamp`

Static Web App:

`swa-agentic-software-development-winter-bootcamp`

Deployment secret in GitHub:

| Name | Purpose |
| --- | --- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_SOFTWARE_DEVELOPMENT_BOOTCAMP` | Dedicated deployment token for this Static Web App |

Application settings in Azure Static Web Apps:

| Name | Required | Purpose |
| --- | --- | --- |
| `REGISTRATION_FLOW_URL` | Yes | Dedicated HTTPS Power Automate trigger URL |
| `REGISTRATION_FLOW_SHARED_SECRET` | Yes | Random value validated with the request header |

Never reuse the data bootcamp's endpoint or secret.

GitHub authentication uses `/.auth/login/github`. The browser reads the verified principal from `/.auth/me`; the API independently requires the platform-provided `x-ms-client-principal` header and ignores any browser-submitted identity.

`public/staticwebapp.config.json` protects `/api/register` with the `authenticated` role, provides the SPA fallback and adds the site's security headers.

## Verification

1. Open the Azure-hosted site in a private browser and confirm unauthenticated registration requires GitHub sign-in.
2. Confirm a request without the platform principal is rejected.
3. Sign in with GitHub and verify the displayed handle.
4. Submit a registration and confirm exactly one List item is created.
5. Change the selected sessions and submit again; confirm the same item is updated and `UpdatedAt` advances.
6. Send an invalid shared secret directly to the flow; confirm HTTP `401` and no List change.
7. Confirm browser responses, Function logs and flow run history do not expose secrets or unnecessary personal data.
