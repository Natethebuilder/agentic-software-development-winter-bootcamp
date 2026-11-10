# Registration form

This is the Microsoft Form that captures registrations while `api/site-state.json` sets `"registration": 4`; see [Registration through Microsoft Forms](../registration-backend.md#registration-through-microsoft-forms). This page records the form so it can be rebuilt.

**Response link** (`registrationFormUrl`): https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxdEa3AwZX5OnfloSBL3H3tUM1pGQkhVWUhFNzFZMFZVMTIzWFFVMlBGMy4u

Responses stay with the form owner in Microsoft Forms and Excel.

## Design

| Setting | Value |
| --- | --- |
| Theme colour | `#34479e` |
| Background image | [`background.png`](background.png), 1920 × 1080 |
| Header image | [`tile.png`](tile.png), 1280 × 720 |
| Header image alt text | Agentic Software Development Winter Bootcamp logo with the GitHub Copilot mascot |

## Title and description

**Title**: Agentic Software Development Winter Bootcamp registration

**Description**:

> From idea to impact, faster together. Six practical one-hour sessions across the software development lifecycle with GitHub Copilot.
> Winter 2027 · Online · Free · AI credits provided
> Every date runs the same six sessions, so pick as many sessions as you like, on as many dates as you like. Dates are preliminary and subject to confirmation. Registration takes about two minutes.

## Questions

Questions 1 to 3 and the consent question are required. The session questions are optional, so a visitor leaves a session blank to skip it.

| # | Question | Type | Subtitle and options |
| --- | --- | --- | --- |
| 1 | Company or organisation | Text | |
| 2 | Company email address | Text, email address | We send your GitHub organization invitation to this address. |
| 3 | Re-enter company email address | Text, email address | Enter the same address again to confirm it. |
| 4 | 09:15 · 01 · GitHub Copilot App Foundations | Choice, multiple answers, optional | Every date runs the same six one-hour sessions. Tick every date you want to attend for each session, and leave a session blank to skip it. |
| 5 | 10:15 · 02 · Plan & Design | Choice, multiple answers, optional | |
| 6 | 11:15 · 03 · Build & Test | Choice, multiple answers, optional | |
| 7 | 12:45 · 04 · Review, Deploy & Operate | Choice, multiple answers, optional | |
| 8 | 13:45 · 05 · Evaluations & Continuous Improvement | Choice, multiple answers, optional | |
| 9 | 14:45 · 06 · AI-Native App Modernization | Choice, multiple answers, optional | |
| 10 | Data consent | Choice, one option | The consent wording, version `2026-11-04` from `REGISTRATION.consent` in `src/content.js`: I consent to Microsoft using my company, company email and session choices to administer the bootcamp, send the GitHub organization invitation, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period. |

Questions 4 to 9 each offer the six dates as options: `15 Jan`, `22 Jan`, `29 Jan`, `5 Feb`, `12 Feb`, `19 Feb`. A visitor can tick the same session on several dates.

There is no development environment question, because this bootcamp offers no cloud development environment. Attendees set up their own machine with the site's readiness checklist.

## Settings

- Who can fill out this form: Anyone can respond. Attendees come from many organisations.
- Accept responses: on.
- Hide "Submit another response": on.
- Allow receipt of responses after submission: on.
- Saving and editing responses: off.

**Thank-you message**: Thanks, we’ve received your registration. GitHub organization access details will be sent to your company email a few days before the event. To change your registration, contact the Microsoft contact who invited you.

## Differences from the site's own form

When processing responses, keep in mind:

- Microsoft Forms only checks that both email entries are email addresses, not that they match, so compare them.
- Microsoft Forms does not require at least one session, so look for responses with no dates ticked.
- Microsoft Forms does not stop the same address registering twice, so look for repeated addresses and keep the latest response.

## Rebuilding the form

Create the form with the design, questions and settings above. Then copy its full response link, in the form `https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=<form id>`, into `registrationFormUrl`. A `/r/` short link is not accepted, so open it and copy the address it leads to.

If the consent wording in `src/content.js` changes, update question 10 to match.
