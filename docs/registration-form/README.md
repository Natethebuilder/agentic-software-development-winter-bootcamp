# Registration form

This is the Microsoft Form that captures registrations while `site-state.json` sets `"registration": 4`; see [Registration through Microsoft Forms](../../README.md#registration-through-microsoft-forms). This page records the form so it can be rebuilt.

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

**Description**, one line per quoted line. The first two lines give the purpose, deletion period and Privacy Statement link that Microsoft's privacy guidance asks for:

> Please fill in the form to register to the event. Microsoft will use the information provided to administer the bootcamp, send the GitHub organization invitation, provision access and communicate event information. Responses are deleted 30 days after the final session.
>
> Please read the Microsoft Privacy Statement: https://go.microsoft.com/fwlink/?LinkId=521839
>
> From idea to impact, faster together. Six practical one-hour sessions across the software development lifecycle with GitHub Copilot.
>
> Winter 2027 · Online · Free · AI credits provided
>
> All times are Central European Time (CET, UTC+1). Every date runs the same six sessions, so pick as many sessions as you like, on as many dates as you like. Dates are preliminary and subject to confirmation. Registration takes about two minutes.
>
> More details can be found here: https://aka.ms/AgenticSoftwareDevelopmentBootcamp

## Questions

Every question is required. Question 4 needs an answer for each session, and "Not attending" skips a session.

| # | Question | Type | Subtitle |
| --- | --- | --- | --- |
| 1 | Company or organisation | Text | |
| 2 | Company email address | Text, email address | We send your formal invitation to this address. |
| 3 | Re-enter company email address | Text, email address | Enter the same address again to confirm it. |
| 4 | Which date would you like to attend each session? | Likert | Select one date per session. Choose “Not attending” to skip a session. All times are CET (UTC+1); dates are in 2027. Privacy: https://go.microsoft.com/fwlink/?LinkId=521839 |

Question 4's statements are the six sessions: `Session 1: GitHub Copilot App Foundations (09:15–10:15)`, `Session 2: Plan & Design (10:15–11:15)`, `Session 3: Build & Test (11:15–12:15)`, `Session 4: Review, Deploy & Operate (12:45–13:45)`, `Session 5: Continuous Improvement (13:45–14:45)` and `Session 6: AI-Native App Modernization (14:45–15:45)`. Its options are the six dates and "Not attending": `Friday 15 January`, `Friday 22 January`, `Friday 29 January`, `Friday 5 February`, `Friday 12 February`, `Friday 19 February`, `Not attending`. Its subtitle ends with the Privacy Statement link because it is the last question, directly above Submit.

Every date falls before European summer time starts in late March, so CET (UTC+1) is right for all of them. A date from late March onwards would need CEST (UTC+2).

The form asks for no name and no consent: it collects only what the invitation needs, and its description says how Microsoft uses the answers.

There is no development environment question, because this bootcamp offers no cloud development environment. Attendees set up their own machine with the site's readiness checklist.

## Settings

- Who can fill out this form: Anyone can respond. Attendees come from many organisations.
- Accept responses: on.
- Hide "Submit another response": on.
- Allow receipt of responses after submission: on.
- Saving and editing responses: off.

**Thank-you message**: Thanks, we’ve received your registration. GitHub organization access details will be sent to your company email a few days before the event. To change your registration, contact the Microsoft contact who invited you.

## Checking responses

When processing responses, keep in mind:

- Microsoft Forms only checks that both email entries are email addresses, not that they match, so compare them.
- Every session can be answered "Not attending", so look for responses that attend no session.
- Microsoft Forms does not stop the same address registering twice, so look for repeated addresses and keep the latest response.

## Privacy and data retention

- **Purpose and Privacy link**: the form's description says how Microsoft uses the answers and when they are deleted, and links the Microsoft Privacy Statement, which question 4's subtitle repeats above Submit. The site's registration dialog also states the purpose and links the Privacy Statement above the embedded form. Use the `go.microsoft.com` link above, the one Microsoft's guidance specifies, rather than `https://aka.ms/privacy`.
- **Required questions**: Microsoft Forms marks each required question with an asterisk and shows that asterisks mean required. The form asks only for what registration needs.
- **Retention**: all registration responses are deleted 30 days after the final session. With the current preliminary dates the final session is Friday 19 February 2027, so responses are deleted on Sunday 21 March 2027; recalculate if the dates change. On that date the form owner deletes:
  - every response in Microsoft Forms (Responses, then More options, then Delete all responses);
  - the Excel workbook of responses, and any downloads, exports or copies such as invitation lists;
  - the records in the `Agentic Software Development Bootcamp Registrations` SharePoint List from the retired on-site form.

## Rebuilding the form

Create the form with the design, questions and settings above. Then copy its full response link, in the form `https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=<form id>`, into `registrationFormUrl`. A `/r/` short link is not accepted, so open it and copy the address it leads to.

To change a question or the description, update the form and this page together.
