import { PREREQUISITES_STATE, REGISTRATION_OPEN } from './siteState.js'

// Shared public content for the landing site and the deck.
// Session topics are confirmed. The six Friday dates are preliminary; facilitators are TBC.

export const BOOTCAMP = {
  name: 'Agentic Software Development Winter Bootcamp',
  short: 'Winter Bootcamp',
  tagline: 'From idea to impact, faster together.',
  subtitle:
    'Six practical sessions across the software development lifecycle, from planning and design to build, review, operations and modernization with GitHub Copilot.',
  season: 'Winter 2027',
  kickoffDate: '2027-01-15',
  kickoffLabel: 'Friday, 15 January 2027 · programme starts at 09:15',
  // ISO timestamp for a live countdown; null shows the kickoff date instead.
  kickoff: null,
  // Switch to true once the six Fridays are confirmed; this removes the "preliminary" labels.
  datesConfirmed: false,
  footer: 'Agentic Software Development Winter Bootcamp',
}

export const DATES_NOTE = BOOTCAMP.datesConfirmed ? '' : 'Dates are preliminary and subject to confirmation.'

const ACCENTS = ['#8fd8ff', '#a99bff', '#5fe3b5', '#5aa9ff', '#ffcf7d', '#e59bff']

export const SESSIONS = [
  {
    id: 'session-01',
    number: '01',
    title: 'GitHub Copilot App Foundations',
    shortTitle: 'Copilot Foundations',
    track: 'Foundations',
    subtitle: 'Navigate the app, manage sessions and context, and guide agents effectively.',
    audience: 'Any role',
    format: 'Hands-on introduction',
    time: '09:15',
    accent: ACCENTS[0],
    spotlight: 'Build the habits and shared vocabulary needed for the rest of the bootcamp.',
    overview:
      'A hands-on introduction to the GitHub Copilot app. Through many short examples, learn how to navigate the app, work with sessions and context, and guide agents effectively. You’ll leave ready to take part in the rest of the bootcamp.',
    outcomes: [
      'Navigate the GitHub Copilot app and its core workflows',
      'Work intentionally with sessions, context and instructions',
      'Guide agents with clear requests, feedback and boundaries',
    ],
    tools: ['Copilot app', 'Sessions', 'Context'],
  },
  {
    id: 'session-02',
    number: '02',
    title: 'Plan & Design',
    shortTitle: 'Plan & Design',
    track: 'Plan & design',
    subtitle: 'Turn scattered input into clear requirements and a standards-aligned design.',
    audience: 'Product Owners, Product Managers, Analysts, Developers, Architects',
    format: 'Collaborative workshop',
    time: '10:15',
    accent: ACCENTS[1],
    spotlight: 'Challenge assumptions and expose technical unknowns before implementation starts.',
    overview:
      'Turn scattered input from emails, workshops, and meetings into clear requirements, then work with a coding agent to challenge assumptions and fill gaps. Shape the requirements into a design based on your architecture and engineering standards, and identify technical unknowns before building starts.',
    outcomes: [
      'Consolidate scattered inputs into reviewable requirements',
      'Challenge assumptions and identify gaps with a coding agent',
      'Shape a design around architecture and engineering standards',
    ],
    tools: ['Requirements', 'Architecture', 'Engineering standards'],
  },
  {
    id: 'session-03',
    number: '03',
    title: 'Build & Test',
    shortTitle: 'Build & Test',
    track: 'Build & test',
    subtitle: 'Steer implementation and testing from an agreed design and bounded scope.',
    audience: 'Developers, Testers',
    format: 'Hands-on build',
    time: '11:15',
    accent: ACCENTS[2],
    spotlight: 'Use skills, guardrails and strong tests to produce high-quality, verifiable results.',
    overview:
      'Starting from a defined design and scope, steer a coding agent through implementation and testing. Explore how skills, guardrails, and a strong testing approach help produce high-quality, verifiable results.',
    outcomes: [
      'Break an approved design into focused implementation work',
      'Use skills and guardrails to keep agents aligned',
      'Build verification into the implementation loop',
    ],
    tools: ['Skills', 'Guardrails', 'Testing'],
  },
  {
    id: 'session-04',
    number: '04',
    title: 'Review, Deploy & Operate',
    shortTitle: 'Review & Operate',
    track: 'Review & operate',
    subtitle: 'Review faster, deploy safely and use AI to investigate production issues.',
    audience: 'Developers, Testers',
    format: 'Delivery workshop',
    time: '12:45',
    accent: ACCENTS[3],
    spotlight: 'Keep review from becoming the bottleneck as coding speed increases.',
    overview:
      'When AI speeds up coding, review can become the bottleneck. Explore faster and more focused ways to review changes so they can be merged and deployed safely. After release, see how AI can help investigate and respond to application issues.',
    outcomes: [
      'Focus reviews on behaviour, evidence and risk',
      'Move approved changes through deployment safely',
      'Investigate and respond to application issues with AI support',
    ],
    tools: ['Pull requests', 'CI/CD', 'Operations'],
  },
  {
    id: 'session-05',
    number: '05',
    title: 'Evaluations & Continuous Improvement',
    shortTitle: 'Evaluations',
    track: 'Evaluate & improve',
    subtitle: 'Measure agentic workflows and improve quality, performance and cost.',
    audience: 'Developers',
    format: 'Evaluation workshop',
    time: '13:45',
    accent: ACCENTS[4],
    spotlight: 'Treat agentic engineering like any other process: measure it, learn and improve.',
    overview:
      'Treat your agentic engineering workflow like any other process: measure it and keep improving it. Review sessions, skills, and recurring mistakes to improve quality, performance, and cost-effectiveness. Explore how to assess decision quality and safely move toward auto-approving low-risk decisions.',
    outcomes: [
      'Review sessions, skills and recurring failure patterns',
      'Measure quality, performance and cost-effectiveness',
      'Assess decision quality before automating low-risk approvals',
    ],
    tools: ['Evaluations', 'Session review', 'Decision quality'],
  },
  {
    id: 'session-06',
    number: '06',
    title: 'AI-Native App Modernization',
    shortTitle: 'App Modernization',
    track: 'Modernize',
    subtitle: 'Apply the full workflow in an end-to-end application modernization scenario.',
    audience: 'Developers, Testers, Architects',
    format: 'Capstone',
    prerequisite: 'Sessions 1–5',
    time: '14:45',
    accent: ACCENTS[5],
    spotlight: 'Bring the complete bootcamp together in a specification-driven modernization capstone.',
    overview:
      'Bring everything from the bootcamp together in an end-to-end modernization scenario. Move from analyzing an existing application through specification-driven design, refactoring, regression testing, and deployment.',
    outcomes: [
      'Analyze an existing application and define modernization intent',
      'Refactor through a specification-driven design',
      'Protect behaviour with regression tests and deploy the result',
    ],
    tools: ['Modernization', 'Refactoring', 'Regression testing'],
  },
]

export const LINEUP = {
  title: 'Run the delivery workflow.',
  subtitle: 'Start the bootcamp workflow, watch it run through all six sessions, then explore what you will learn in each one.',
  agent: 'winter-bootcamp.yml',
  trigger: 'on: workflow_dispatch',
  coreTitle: 'Delivery workflow',
  coreDetail: '6 jobs · idea → production',
  run: 'Run workflow',
  running: 'Running six jobs…',
  done: 'All six jobs succeeded. Select a job to jump to its session.',
}

export const SESSION_DATES = [
  { id: '2027-01-15', label: 'Friday, 15 January 2027', short: '15 Jan', day: '15', month: 'JAN' },
  { id: '2027-01-22', label: 'Friday, 22 January 2027', short: '22 Jan', day: '22', month: 'JAN' },
  { id: '2027-01-29', label: 'Friday, 29 January 2027', short: '29 Jan', day: '29', month: 'JAN' },
  { id: '2027-02-05', label: 'Friday, 5 February 2027', short: '5 Feb', day: '05', month: 'FEB' },
  { id: '2027-02-12', label: 'Friday, 12 February 2027', short: '12 Feb', day: '12', month: 'FEB' },
  { id: '2027-02-19', label: 'Friday, 19 February 2027', short: '19 Feb', day: '19', month: 'FEB' },
]

export const registrationSlotId = (dateId, session) => `${dateId}|${session.time}|${session.id}`

export const PERSONAS = [
  {
    id: 'product', icon: '🧭', label: 'Product & architecture',
    desc: 'Turn scattered intent into requirements, decisions and designs.',
    does: 'Use agents to consolidate inputs, challenge assumptions and shape a design that follows your architecture and engineering standards.',
    stack: ['Inputs', 'Requirements', 'Decisions', 'Design'],
  },
  {
    id: 'delivery', icon: '💻', label: 'Developers & testers',
    desc: 'Build, verify, review and deploy focused changes.',
    does: 'Steer coding agents through implementation and testing while keeping evidence, risk and human accountability visible.',
    stack: ['Code', 'Tests', 'Pull requests', 'CI/CD'],
  },
  {
    id: 'improvement', icon: '📈', label: 'Engineering teams',
    desc: 'Learn from sessions, production signals and repeated mistakes.',
    does: 'Evaluate agentic workflows, improve quality and cost, and decide where low-risk automation can safely increase.',
    stack: ['Sessions', 'Evaluations', 'Operations', 'Learning'],
  },
]

export const TEAM = [
  {
    id: 'programme-team',
    name: 'To be announced',
    initials: 'TBC',
    role: 'Programme team',
    focus: 'Programme coordination and session facilitators will be published when finalised',
    accent: '#9080c0',
  },
]

// The ids select the animated glyph in src/agentic/PillarMark.jsx.
export const PILLARS = [
  {
    id: 'foundations',
    tag: 'Habits first',
    title: 'Start with strong foundations',
    desc: 'Learn the Copilot app, sessions, context and agent guidance before moving into delivery workflows.',
  },
  {
    id: 'whole-loop',
    tag: '6 stages · 1 loop',
    title: 'Practise the whole delivery loop',
    desc: 'Connect planning, design, code, tests, reviews, releases, operations and modernization.',
  },
  {
    id: 'evidence',
    tag: 'Measure → improve',
    title: 'Improve with evidence',
    desc: 'Use reviewable plans, executable checks, evaluations and visible delivery signals to keep improving.',
  },
]

export const GITHUB_ACCESS = {
  eyebrow: 'GitHub organization access',
  title: 'Event organization access and GitHub Copilot AI credits.',
  description:
    'A few days before the event starts, registered attendees will receive an invitation containing the link to join the event GitHub organization. AI credits to use with GitHub Copilot are provided in the event environment.',
}

// Hero console: one example GitHub Copilot run for each session, shown as an agent trace.
// spans[0] is the root agent span; each child op picks its colour in src/data/DataViz.jsx.
export const AGENT_RUNS = [
  {
    session: 'session-01',
    area: 'Sessions',
    actor: 'you',
    input: 'Explain how this repo is structured and where I should start',
    spans: [
      { op: 'agent', name: 'explore · contoso-shop', meta: '42s' },
      { op: 'context', name: '.github/copilot-instructions.md', meta: 'loaded' },
      { op: 'search', name: 'src/**/*.ts', meta: '128 files' },
      { op: 'read', name: 'README.md · docs/architecture.md', meta: '2 files' },
      { op: 'answer', name: 'codebase map', meta: '6 modules' },
    ],
    result: 'Repository mapped with your team instructions applied',
  },
  {
    session: 'session-02',
    area: 'Planning',
    actor: 'you',
    input: 'Turn issue #142 into a spec and flag the open decisions',
    spans: [
      { op: 'agent', name: 'plan · issue-142', meta: '1m 08s' },
      { op: 'read', name: 'issue #142 + meeting notes', meta: '4 sources' },
      { op: 'plan', name: 'acceptance criteria', meta: '5 scenarios' },
      { op: 'design', name: 'docs/adr/014-checkout.md', meta: 'drafted' },
      { op: 'ask', name: 'open decisions', meta: '2 for you' },
    ],
    result: 'Spec and design ready for team review',
  },
  {
    session: 'session-03',
    area: 'Coding agent',
    actor: 'you',
    input: 'Implement the approved checkout slice, with tests',
    spans: [
      { op: 'agent', name: 'build · checkout-slice', meta: '3m 41s' },
      { op: 'skill', name: 'repo-conventions', meta: 'applied' },
      { op: 'edit', name: 'src/checkout/*', meta: '4 files' },
      { op: 'test', name: 'npm test', meta: '18 passed' },
      { op: 'lint', name: 'eslint + tsc', meta: 'clean' },
    ],
    result: 'Focused change ready for review',
  },
  {
    session: 'session-04',
    area: 'Code review',
    actor: 'you',
    input: 'Review PR #286 and tell me what could break',
    spans: [
      { op: 'agent', name: 'review · pr-286', meta: '1m 52s' },
      { op: 'diff', name: '12 files changed', meta: '+284 −61' },
      { op: 'review', name: 'behaviour traced', meta: '3 paths' },
      { op: 'checks', name: 'ci.yml', meta: '6/6 passed' },
      { op: 'deploy', name: 'staging', meta: 'healthy' },
    ],
    result: 'Review evidence ready for your approval',
  },
  {
    session: 'session-05',
    area: 'Evaluations',
    actor: 'you',
    input: 'Which agent sessions needed the most rework this sprint?',
    spans: [
      { op: 'agent', name: 'evaluate · sprint-24', meta: '58s' },
      { op: 'read', name: 'agent sessions', meta: '42 analysed' },
      { op: 'pattern', name: 'missing test fixtures', meta: '7 repeats' },
      { op: 'metric', name: 'cost per merged PR', meta: '−18%' },
      { op: 'skill', name: 'test-fixtures', meta: 'updated' },
    ],
    result: 'Improvement proposed with evidence',
  },
  {
    session: 'session-06',
    area: 'Modernization',
    actor: 'you',
    input: 'Modernize the legacy orders service without changing behaviour',
    spans: [
      { op: 'agent', name: 'modernize · orders-service', meta: '6m 20s' },
      { op: 'analyze', name: 'legacy orders service', meta: '38 files' },
      { op: 'spec', name: 'current behaviour', meta: '24 scenarios' },
      { op: 'refactor', name: 'OrdersController + 9 files', meta: 'done' },
      { op: 'test', name: 'regression suite', meta: '142 passed' },
    ],
    result: 'Modernized service ready to deploy',
  },
]

export const PREREQUISITES = {
  soon: {
    title: 'Pre-flight checks',
    subtitle: 'The software and access checks for the hands-on sessions will be published here.',
    mark: '🧰',
    label: 'Setup pending',
    heading: 'Prerequisites are being prepared.',
    body: 'We will publish the required tools, account checks and guided setup here before the bootcamp, and include them in the event communication.',
  },
  ready: {
    title: 'Pre-flight checks',
    subtitle: 'Complete these software and access checks on your own machine before your first hands-on session.',
  },
}

export const PREP = [
  { id: 'github', icon: '🐙', title: 'GitHub account ready', desc: 'Use the GitHub.com account that will accept the event organization invitation.' },
  { id: 'copilot', icon: '🤖', title: 'GitHub Copilot access', desc: 'Bring an active Copilot plan through your organisation, education access or individual subscription.' },
  { id: 'git', icon: '🌿', title: 'Git installed', desc: 'A current Git installation supports the hands-on repository workflows.' },
  { id: 'gh-cli', icon: '⌨️', title: 'GitHub CLI', desc: 'Install and authenticate gh for repository, pull request and workflow exercises.' },
  { id: 'node', icon: '🟩', title: 'Node.js LTS', desc: 'Use a supported Node.js LTS release for the sample application and automation.' },
  { id: 'sample', icon: '🔒', title: 'Sample repository only', desc: 'Use workshop or non-sensitive code. Do not bring credentials or confidential production repositories.' },
]

export const READINESS_PATHS = [
  {
    id: 'ready',
    title: 'Already ready',
    desc: 'If every check passes, you can arrive ready for the hands-on work.',
  },
  {
    id: 'setup',
    title: 'Able to install locally',
    desc: 'Complete the guided setup below before your first hands-on session.',
  },
  {
    id: 'unable',
    title: 'Unsure or unable to install',
    desc: 'Check early with your IT team whether you can install these tools. You can still join the sessions and follow along with the presenter.',
  },
]

export const SETUP_RESOURCES = [
  { id: 'git', label: 'Git', check: 'git --version', login: 'No sign-in required', href: 'https://git-scm.com/downloads' },
  { id: 'gh', label: 'GitHub CLI', check: 'gh --version', login: 'gh auth login', href: 'https://cli.github.com/' },
  { id: 'node', label: 'Node.js LTS', check: 'node --version', login: 'No sign-in required', href: 'https://nodejs.org/' },
  { id: 'copilot', label: 'GitHub Copilot CLI', check: 'copilot --version', login: 'copilot', href: 'https://docs.github.com/copilot' },
  { id: 'skills', label: 'Agent Skills', check: '/skills', login: 'Verify the workshop skills are available', href: 'https://docs.github.com/copilot' },
  { id: 'github-mcp', label: 'GitHub MCP Server', check: '/mcp', login: 'Verify GitHub MCP is connected', href: 'https://github.com/github/github-mcp-server' },
]

export const FAQ = [
  {
    q: 'Who is this for?',
    a: 'The broader software development community. The foundations session is for any role, while later sessions focus on product, analysis, architecture, development and testing.',
  },
  {
    q: 'What are the session topics?',
    a: 'GitHub Copilot App Foundations; Plan & Design; Build & Test; Review, Deploy & Operate; Evaluations & Continuous Improvement; and AI-Native App Modernization.',
  },
  {
    q: 'When does it start?',
    a: `The complete six-session programme runs on Fridays 15, 22 and 29 January and 5, 12 and 19 February 2027. Sessions start at 09:15, 10:15, 11:15, 12:45, 13:45 and 14:45.${DATES_NOTE ? ` ${DATES_NOTE}` : ''}`,
  },
  {
    q: 'Do I need advanced AI experience?',
    a: 'No. The programme starts from familiar software delivery artefacts and makes the role of agents practical and reviewable.',
  },
  {
    q: 'Is it hands-on?',
    a: PREREQUISITES_STATE === 'ready'
      ? 'Yes, where possible. The readiness checklist and guided setup explain what to prepare before your first hands-on session.'
      : 'Yes, where possible. The readiness checklist and guided setup will be published before the bootcamp.',
  },
  {
    q: 'What do I need to prepare?',
    a: PREREQUISITES_STATE === 'ready'
      ? 'A GitHub account, GitHub Copilot access, Git, GitHub CLI, Node.js LTS and a sample or non-sensitive repository. The website includes a saved checklist and guided setup.'
      : 'The required tools, account checks and guided setup will be published here before the bootcamp.',
  },
  {
    q: 'What is included with the event GitHub environment?',
    a: 'You receive access to the event GitHub organization and free AI credits to use with GitHub Copilot.',
  },
  {
    q: 'How do I access the GitHub organization?',
    a: 'A few days before the event starts, your event invitation will include the link used to join the organization.',
  },
  {
    q: 'How do I register?',
    a: REGISTRATION_OPEN
      ? 'Provide and confirm your company email, then choose your dates and sessions. No GitHub sign-in is required on this website.'
      : 'Registration will open soon. When it does, provide and confirm your company email, then choose your dates and sessions.',
  },
]

export const REGISTER_STEPS = [
  'Enter and confirm your company email address',
  'Choose the dates and session times you want to attend',
  'Receive the GitHub organization invitation link a few days before the event',
]

export const REGISTRATION = {
  eyebrow: 'Registration',
  title: 'Join the Agentic Software Development Winter Bootcamp.',
  subtitle: 'Confirm your company email and choose the dates and session times you want to attend.',
  slotHelp:
    'Every date runs the same six sessions, so you can mix and match, for example Foundations on 15 January and Build & Test on 22 January. Switch dates with the tabs below; sessions you have ticked on other dates stay selected.',
  consent:
    'I consent to Microsoft using my company, company email and session choices to administer the bootcamp, send the GitHub organization invitation, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period.',
  success: 'Thanks. Your registration is saved. GitHub organization access details will be sent a few days before the event.',
}

export const REGISTRATION_SOON = {
  eyebrow: 'Registration',
  title: 'Registration will open soon.',
  subtitle: 'The programme is ready and the registration flow is being prepared. Check back soon to choose your dates and sessions.',
  badge: 'Opening soon',
  heading: 'Registration will open soon',
  body: 'All six sessions run on every date, so once registration opens you can pick as many sessions as you like, on as many dates as you like.',
  cta: 'Registration opens soon',
}
