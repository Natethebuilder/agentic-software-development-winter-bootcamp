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
| Header image alt text | AI-Native Software Development Lifecycle Winter Bootcamp logo with the GitHub Copilot mascot |

## Title and description

**Title**: AI-Native Software Development Lifecycle Winter Bootcamp registration

**Description**, one line per quoted line, with the time zone line in bold:

> From idea to impact, faster together. Six practical one-hour sessions across the software development lifecycle with GitHub Copilot.
>
> Winter 2027 · Online · Free · AI credits provided
>
> **All times are Central European Time (CET, UTC+1).**
>
> Every date runs the same six sessions, so pick as many sessions as you like, on as many dates as you like. Dates are preliminary and subject to confirmation. Registration takes about two minutes.

## Questions

Questions 1 to 4 and the consent question are required. The session questions are optional, so a visitor leaves a session blank to skip it.

| # | Question | Type | Subtitle and options |
| --- | --- | --- | --- |
| 1 | Participant’s full name | Text | Enter your first and last name so we can distinguish your registration and associate it with your company email address. |
| 2 | Company or organisation | Text | |
| 3 | Company email address | Text, email address | We send your formal invitation to this address. |
| 4 | Re-enter company email address | Text, email address | Enter the same address again to confirm it. |
| 5 | GitHub Copilot App Foundations | Choice, multiple answers, optional | **09:15–10:15 CET**<br>Tick each date you want to attend, or leave it blank to skip this session. |
| 6 | Plan & Design | Choice, multiple answers, optional | **10:15–11:15 CET** |
| 7 | Build & Test | Choice, multiple answers, optional | **11:15–12:15 CET** |
| 8 | Review, Deploy & Operate | Choice, multiple answers, optional | **12:45–13:45 CET** |
| 9 | Evaluations & Continuous Improvement | Choice, multiple answers, optional | **13:45–14:45 CET** |
| 10 | AI-Native App Modernization | Choice, multiple answers, optional | **14:45–15:45 CET** |
| 11 | Data consent | Choice, one option | I consent to Microsoft using my name, company, company email and session choices to administer the bootcamp, send the GitHub organization invitation, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period. |

Each session question's title is the session name, and its subtitle starts with the session's time range in bold. Questions 5 to 10 each offer the six dates as options: `Friday 15 January`, `Friday 22 January`, `Friday 29 January`, `Friday 5 February`, `Friday 12 February`, `Friday 19 February`. A visitor can tick the same session on several dates.

Every date falls before European summer time starts in late March, so CET (UTC+1) is right for all of them. A date from late March onwards would need CEST (UTC+2).

The consent option is `REGISTRATION.consent` from `src/content.js` (version `2026-11-04`) with "name" added, because this form also asks for the participant's full name.

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

If the consent wording in `src/content.js` changes, update question 11 to match, keeping "name" in it.
