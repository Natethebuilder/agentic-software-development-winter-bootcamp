# Software Development registration backend

The live site uses a public registration form and the shared registration flow originally created for the Agentic Data Winter Bootcamp. GitHub OAuth is not used for registration. The Software Development API sends the constant event identifier:

```json
{
  "eventId": "agentic-software-development-winter-bootcamp"
}
```

The shared flow validates the secret, routes by `eventId`, and stores this event in its own private SharePoint List. No separate Software Development flow is required.

## Dedicated SharePoint target

- Site: `https://microsofteur.sharepoint.com/teams/AgenticSoftwareDevelopmentWinterBootcamp`
- Site title: `Agentic Software Development Winter Bootcamp`
- List: `Agentic Software Development Bootcamp Registrations`
- List ID: `33add272-6226-4ee7-9430-440fd7e7612d`
- Privacy: private, with two site owners
- Permissions: inherited from the private operations site
- Sensitivity: `Confidential \ Internal-Only`
- Version history: enabled, 50 versions

## List schema

| Display name | Type | Required | Notes |
| --- | --- | --- | --- |
| Title | Single line text | Yes | Legacy field currently receives `not-collected` |
| RegistrationId | Single line text | Yes | Unique and indexed |
| GitHubUserId | Single line text | Yes | Legacy compatibility field set to `not-collected` |
| GitHubUsername | Single line text | Yes | Legacy compatibility field set to `not-collected` |
| Company | Single line text | Yes | Organisation |
| CompanyEmail | Single line text | Yes | Event communication |
| Sessions | Multiple lines text | Yes | Semicolon-delimited session IDs |
| Environment | Choice | Yes | Drop-down containing only `local` and `cloud` |
| Consent | Yes/No | Yes | Explicit consent |
| UpdatedAt | Date and time | Yes | Latest submission timestamp |

## Shared flow routing

The deployed flow keeps the existing shared-secret condition and adds `Route_registration` to the valid-secret branch:

1. `eventId` is an optional request-schema property for backward compatibility.
2. `agentic-software-development-winter-bootcamp` routes to the Software Development site and List.
3. `Get_software_items` queries `RegistrationId` with top count `1`.
4. `Software_registration_exists` updates the first matching item or creates one when absent.
5. `Software_response` returns HTTP `202`.
6. Missing or unrecognized `eventId` values continue to the unchanged Data branch while the legacy Data client is migrated.
7. An invalid shared secret continues to return HTTP `401`.

The attendee enters the company email twice, and the browser and API reject values that do not match. This reduces typing mistakes but does not verify ownership of the mailbox.

On the first successful registration, the API generates an opaque UUID token and returns it to the browser. The browser stores it in local storage for later updates. The API calculates:

```text
SHA256("agentic-software-development-winter-bootcamp:" + registrationToken)
```

This keeps registration IDs event-specific and lets the same browser update the same record without using the email address as an authentication credential. GitHub identity is not collected; the required legacy fields receive `not-collected`.

## Golden Ticket access

A few days before the event starts, the event invitation supplies the Golden Ticket link used to join the event GitHub organization. The environment includes $100 worth of AI credits for GitHub Copilot.

## Azure settings

The following settings are configured on `swa-agentic-software-development-winter-bootcamp` and match the shared values used by the Data site:

| Name | Value |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Existing shared registration flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Secret validated by the shared flow |

Do not expose these values in source, browser responses, documentation or logs.

## Live verification

- The public site returns HTTP `200`.
- The GitHub OAuth login route is disabled.
- Public `POST /api/register` validates matching email entries, sessions, environment and consent.
- An intentionally invalid shared secret returns HTTP `401`.
- A valid submission creates one Software Development List item and returns an opaque browser registration token.
- The create run executed `Create_software_registration`; the Data actions were skipped.
- Repeating from the same browser uses the stored token to update the same row.
