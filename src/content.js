export const EVENT = {
  id: 'agentic-software-development-winter-bootcamp',
  name: 'Agentic Software Development Winter Bootcamp',
  shortName: 'Agentic Dev Winter',
  season: 'Winter 2026',
  format: 'Six live community sessions · Dates TBC',
  eyebrow: 'GitHub Copilot × the software development lifecycle',
  tagline: 'Build the next loop.',
  subtitle:
    'A practical community bootcamp exploring how developers can collaborate with AI agents from the first issue to production.',
  audience:
    'For developers, testers, architects, platform engineers, engineering leaders and anyone shaping how software gets built.',
}

export const NAV = [
  { label: 'Why', href: '#why' },
  { label: 'SDLC', href: '#sdlc' },
  { label: 'Sessions', href: '#sessions' },
  { label: 'Prepare', href: '#prepare' },
  { label: 'FAQ', href: '#faq' },
]

export const SDLC_STAGES = [
  {
    id: 'spec',
    label: '01',
    title: 'Frame the work',
    object: 'Issue + spec',
    prompt: 'Turn intent into testable scope.',
    signal: 'Acceptance criteria',
    command: '@copilot refine this issue',
  },
  {
    id: 'plan',
    label: '02',
    title: 'Design the change',
    object: 'Plan + branch',
    prompt: 'Expose assumptions before code.',
    signal: 'Reviewable approach',
    command: '@copilot propose an implementation plan',
  },
  {
    id: 'build',
    label: '03',
    title: 'Build with an agent',
    object: 'Code + tests',
    prompt: 'Delegate bounded work, keep judgement.',
    signal: 'Working increment',
    command: 'copilot /delegate',
  },
  {
    id: 'review',
    label: '04',
    title: 'Review the evidence',
    object: 'Pull request',
    prompt: 'Inspect behaviour, risk and clarity.',
    signal: 'Human-approved diff',
    command: '@copilot review this pull request',
  },
  {
    id: 'ship',
    label: '05',
    title: 'Ship with confidence',
    object: 'CI + deployment',
    prompt: 'Make checks and release state visible.',
    signal: 'Healthy production',
    command: 'gh run watch',
  },
  {
    id: 'learn',
    label: '06',
    title: 'Learn from production',
    object: 'Telemetry + backlog',
    prompt: 'Feed real signals into the next issue.',
    signal: 'A better next loop',
    command: '@copilot diagnose this failure',
  },
]

export const VALUE = [
  {
    number: '01',
    title: 'Work in the open',
    body: 'Issues, specs, branches, pull requests and checks become the shared context for people and agents.',
  },
  {
    number: '02',
    title: 'Keep humans accountable',
    body: 'Copilot accelerates exploration and execution; teams still own intent, review, safety and release decisions.',
  },
  {
    number: '03',
    title: 'Practise the full loop',
    body: 'The programme connects planning, coding, testing, review, delivery and learning instead of treating AI as autocomplete.',
  },
]

export const SESSIONS = Array.from({ length: 6 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return {
    id: `session-${number}`,
    number,
    title: '[Topic TBC]',
    subtitle: 'Agentic SDLC session details will be announced.',
    date: '[Date TBC]',
    time: '[Time TBC]',
    speaker: '[Speaker TBC]',
    headshot: null,
  }
})

export const PREP = [
  {
    title: 'GitHub account',
    body: 'Use the GitHub identity you want associated with your registration and workshop activity.',
    state: 'Required',
  },
  {
    title: 'GitHub Copilot access',
    body: 'Bring an active Copilot plan through your organisation, education access or an individual subscription.',
    state: 'Required',
  },
  {
    title: 'Development environment',
    body: 'A current browser is enough to follow. Local Git, VS Code and GitHub CLI are useful for hands-on practice.',
    state: 'Recommended',
  },
]

export const FAQ = [
  {
    question: 'Who is this for?',
    answer:
      'The wider software development community: individual contributors, engineering leaders and adjacent roles curious about agentic ways of working.',
  },
  {
    question: 'Do I need advanced AI experience?',
    answer:
      'No. The bootcamp is framed around familiar software delivery artefacts and shows where agents fit, where they do not and how to stay in control.',
  },
  {
    question: 'Are the dates and speakers confirmed?',
    answer:
      'Not yet. The six session places are reserved and will be updated as the programme is confirmed.',
  },
  {
    question: 'Can I register for selected sessions?',
    answer:
      'Yes. Sign in with GitHub and select any combination of the six sessions. Submitting again updates your existing registration.',
  },
]

export const REGISTRATION = {
  heading: 'Reserve your place in the loop.',
  body:
    'Sign in with GitHub, choose the sessions you want and tell us how you plan to participate. You can update the same registration later.',
  environments: [
    { id: 'local', label: 'Local development environment' },
    { id: 'cloud', label: 'Cloud / browser development environment' },
  ],
  consent:
    'I agree that my registration details may be used to administer this event. Event operations will retain them only for the stated administration period.',
}
