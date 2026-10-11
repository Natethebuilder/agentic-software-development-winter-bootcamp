# Software Development registration backend

The live site uses Azure Static Web Apps GitHub authentication and the shared registration flow originally created for the Agentic Data Winter Bootcamp. The Software Development API sends the constant event identifier:

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
| Title | Single line text | Yes | GitHub username |
| RegistrationId | Single line text | Yes | Unique and indexed |
| GitHubUserId | Single line text | Yes | Application-scoped GitHub identity |
| GitHubUsername | Single line text | Yes | Verified username |
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

The API calculates:

```text
SHA256("agentic-software-development-winter-bootcamp:" + applicationScopedGitHubUserId)
```

This keeps registration IDs event-specific and makes repeat submissions deterministic updates.

## Azure settings

The following settings are configured on `swa-agentic-software-development-winter-bootcamp` and match the shared values used by the Data site:

| Name | Value |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Existing shared registration flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Secret validated by the shared flow |

Do not expose these values in source, browser responses, documentation or logs.

## Live verification

- The public site returns HTTP `200`.
- Unauthenticated `POST /api/register` redirects to GitHub authentication.
- An intentionally invalid shared secret returns HTTP `401`.
- A GitHub-authenticated submission creates one Software Development List item and returns the registration success state.
- The create run executed `Create_software_registration`; the Data actions were skipped.
- Repeating the same registration kept the List at one row, advanced `UpdatedAt`, executed `Update_software_registration`, and skipped both the Software create action and every Data action.
