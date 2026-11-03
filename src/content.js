import { PREREQUISITES_STATE, REGISTRATION_OPEN } from './siteState.js'

// Shared public content for the landing site and the deck.
// Session topics are confirmed. Facilitators, dates and times remain TBC.

export const BOOTCAMP = {
  name: 'Agentic Software Development Winter Bootcamp',
  short: 'Winter Bootcamp',
  tagline: 'From idea to impact — faster, together.',
  subtitle:
    'A six-session community programme for learning how GitHub Copilot and coding agents support the complete software delivery loop.',
  season: 'Winter',
  kickoffDate: null,
  kickoffLabel: 'Six Friday dates shown for registration testing · final dates TBC',
  kickoff: null,
  footer: 'Agentic Software Development Winter Bootcamp',
}

const ACCENTS = ['#d4a06a', '#9080c0', '#7aaac8', '#6a9e84', '#cc8e82', '#e0b56d']

export const SESSIONS = [
  {
    id: 'session-01',
    number: '01',
    title: 'GitHub Copilot App Foundations',
    shortTitle: 'Copilot Foundations',
    track: 'FOUNDATIONS',
    subtitle: 'Navigate the app, manage sessions and context, and guide agents effectively.',
    audience: 'Any role',
    format: 'Hands-on introduction',
    time: '09:15',
    scheduleMark: 'APP',
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
    track: 'PLAN & DESIGN',
    subtitle: 'Turn scattered input into clear requirements and a standards-aligned design.',
    audience: 'Product Owners, Product Managers, Analysts, Developers, Architects',
    format: 'Collaborative workshop',
    time: '10:15',
    scheduleMark: 'PLAN',
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
    track: 'BUILD & TEST',
    subtitle: 'Steer implementation and testing from an agreed design and bounded scope.',
    audience: 'Developers, Testers',
    format: 'Hands-on build',
    time: '11:15',
    scheduleMark: 'BUILD',
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
    track: 'REVIEW & OPERATE',
    subtitle: 'Review faster, deploy safely and use AI to investigate production issues.',
    audience: 'Developers, Testers',
    format: 'Delivery workshop',
    time: '12:45',
    scheduleMark: 'SHIP',
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
    track: 'EVALUATE & IMPROVE',
    subtitle: 'Measure agentic workflows and improve quality, performance and cost.',
    audience: 'Developers',
    format: 'Evaluation workshop',
    time: '13:45',
    scheduleMark: 'EVAL',
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
    track: 'MODERNIZATION',
    subtitle: 'Apply the full workflow in an end-to-end application modernization scenario.',
    audience: 'Developers, Testers, Architects',
    format: 'Capstone',
    prerequisite: 'Sessions 1–5',
    time: '14:45',
    scheduleMark: 'MOD',
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
  title: 'Run the software delivery loop.',
  subtitle: 'Start the programme workflow, watch it hand off through all six sessions, then inspect each stage.',
  agent: 'programme.yml',
  coreTitle: 'Delivery orchestrator',
  coreDetail: '6 sessions · one software loop',
  run: 'Run the programme workflow',
  running: 'Handing off across the delivery loop…',
  done: 'All six sessions are ready. Select a stage to jump to its session.',
}

export const SESSION_DATES = [
  { id: '2026-12-04', label: 'Friday, 4 December 2026', short: '4 Dec', day: '04', month: 'DEC' },
  { id: '2026-12-11', label: 'Friday, 11 December 2026', short: '11 Dec', day: '11', month: 'DEC' },
  { id: '2026-12-18', label: 'Friday, 18 December 2026', short: '18 Dec', day: '18', month: 'DEC' },
  { id: '2027-01-08', label: 'Friday, 8 January 2027', short: '8 Jan', day: '08', month: 'JAN' },
  { id: '2027-01-15', label: 'Friday, 15 January 2027', short: '15 Jan', day: '15', month: 'JAN' },
  { id: '2027-01-22', label: 'Friday, 22 January 2027', short: '22 Jan', day: '22', month: 'JAN' },
]

export const registrationSlotId = (dateId, session) => `${dateId}|${session.time}|${session.id}`

export const PERSONAS = [
  {
    id: 'product', icon: 'PLAN', label: 'Product & architecture',
    desc: 'Turn scattered intent into requirements, decisions and designs.',
    does: 'Use agents to consolidate inputs, challenge assumptions and shape a design that follows your architecture and engineering standards.',
    stack: ['Inputs', 'Requirements', 'Decisions', 'Design'],
  },
  {
    id: 'delivery', icon: '{ }', label: 'Developers & testers',
    desc: 'Build, verify, review and deploy focused changes.',
    does: 'Steer coding agents through implementation and testing while keeping evidence, risk and human accountability visible.',
    stack: ['Code', 'Tests', 'Pull requests', 'CI/CD'],
  },
  {
    id: 'improvement', icon: '↻', label: 'Engineering teams',
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

export const PILLARS = [
  {
    id: 'foundations',
    icon: '01',
    title: 'Start with strong foundations',
    desc: 'Learn the Copilot app, sessions, context and agent guidance before moving into delivery workflows.',
  },
  {
    id: 'whole-loop',
    icon: '02',
    title: 'Practise the whole delivery loop',
    desc: 'Connect planning, design, code, tests, reviews, releases, operations and modernization.',
  },
  {
    id: 'evidence',
    icon: '03',
    title: 'Improve with evidence',
    desc: 'Use reviewable plans, executable checks, evaluations and visible delivery signals to keep improving.',
  },
]

export const GITHUB_ACCESS = {
  eyebrow: 'GitHub organization access',
  title: 'Event organization access and $100 of GitHub Copilot AI credits.',
  description:
    'A few days before the event starts, registered attendees will receive an invitation containing the link to join the event GitHub organization. The event environment includes $100 worth of AI credits to use with GitHub Copilot.',
}

export const PIPELINE = [
  {
    id: 'issue', label: 'Issue', sub: 'intent', color: '#8fd8ff',
    what: 'Capture the problem, user outcome and constraints in a shared work item.',
    prompt: 'Refine this request into clear scope and acceptance criteria.',
    gate: 'Intent is testable',
  },
  {
    id: 'spec', label: 'Spec', sub: 'plan', color: '#b88cff',
    what: 'Expose assumptions, architecture decisions and a bounded implementation path.',
    prompt: 'Propose a reviewable plan and identify open decisions.',
    gate: 'Plan reviewed',
  },
  {
    id: 'build', label: 'Build', sub: 'code + tests', color: '#ffb454',
    what: 'Implement a focused increment with tests and repository conventions.',
    prompt: 'Implement the approved slice and validate the behaviour.',
    gate: 'Checks passing',
  },
  {
    id: 'review', label: 'Review', sub: 'pull request', color: '#55d6a9',
    what: 'Inspect behaviour, clarity, risk and the evidence behind the change.',
    prompt: 'Review this pull request for correctness and maintainability.',
    gate: 'Human approval',
  },
  {
    id: 'release', label: 'Release', sub: 'ship + learn', color: '#4fd1e8',
    what: 'Deliver through observable automation and feed production learning back into the backlog.',
    prompt: 'Summarise release readiness and investigate any failing signal.',
    gate: 'Healthy delivery',
  },
]

export const TERMINAL_SCRIPTS = [
  {
    workspace: '~/issue-to-spec',
    prompt: 'Turn issue #142 into a testable specification and identify the decisions the team still needs to make',
    lines: [
      { kind: 'info', text: 'Reading issue and repository context', meta: 'issue #142' },
      { kind: 'ok', text: 'acceptance criteria', meta: '5 scenarios' },
      { kind: 'ok', text: 'implementation boundaries', meta: '3 components' },
      { kind: 'ok', text: 'open decisions', meta: '2 for team review' },
      { kind: 'done', text: 'Specification ready for review' },
    ],
  },
  {
    workspace: '~/implementation',
    prompt: 'Implement the approved authentication slice with tests and keep the change focused',
    lines: [
      { kind: 'info', text: 'Reading plan and conventions', meta: 'specs/auth.md' },
      { kind: 'ok', text: 'implementation', meta: '4 files changed' },
      { kind: 'ok', text: 'unit tests', meta: '18 passing' },
      { kind: 'ok', text: 'lint and type check', meta: 'clean' },
      { kind: 'done', text: 'Focused change ready for review' },
    ],
  },
  {
    workspace: '~/pull-request',
    prompt: 'Review this pull request for behaviour changes, missing tests and maintainability risks',
    lines: [
      { kind: 'info', text: 'Reading diff and linked issue', meta: 'PR #286' },
      { kind: 'ok', text: 'behaviour traced', meta: '3 execution paths' },
      { kind: 'ok', text: 'test gap identified', meta: '1 edge case' },
      { kind: 'ok', text: 'review summary', meta: 'actionable feedback' },
      { kind: 'done', text: 'Review evidence ready' },
    ],
  },
  {
    workspace: '~/delivery',
    prompt: 'Investigate the failing CI run and propose the smallest safe fix',
    lines: [
      { kind: 'info', text: 'Reading workflow logs', meta: 'run #9841' },
      { kind: 'ok', text: 'failure isolated', meta: 'integration test' },
      { kind: 'ok', text: 'root cause explained', meta: 'environment drift' },
      { kind: 'ok', text: 'safe fix proposed', meta: '1 workflow change' },
      { kind: 'done', text: 'Delivery path ready to recover' },
    ],
  },
]

export const PREREQUISITES = {
  soon: {
    title: 'Pre-flight checks',
    subtitle: 'The software and access checks for the hands-on sessions will be published here.',
    mark: '>_',
    label: 'Setup pending',
    heading: 'Prerequisites are being prepared.',
    body: 'We will publish the required tools, account checks and guided setup here before the bootcamp, and include them in the event communication.',
  },
  ready: {
    title: 'Pre-flight checks',
    subtitle: 'Complete these software and access checks locally before your first hands-on session, or request a limited cloud environment during registration.',
  },
}

export const PREP = [
  { id: 'github', icon: 'GH', title: 'GitHub account ready', desc: 'Use the GitHub.com account that will accept the event organization invitation.' },
  { id: 'copilot', icon: 'AI', title: 'GitHub Copilot access', desc: 'Bring an active Copilot plan through your organisation, education access or individual subscription.' },
  { id: 'git', icon: 'Git', title: 'Git installed', desc: 'A current Git installation supports the hands-on repository workflows.' },
  { id: 'gh-cli', icon: 'CLI', title: 'GitHub CLI', desc: 'Install and authenticate gh for repository, pull request and workflow exercises.' },
  { id: 'node', icon: 'JS', title: 'Node.js LTS', desc: 'Use a supported Node.js LTS release for the sample application and automation.' },
  { id: 'sample', icon: 'Repo', title: 'Sample repository only', desc: 'Use workshop or non-sensitive code. Do not bring credentials or confidential production repositories.' },
]

export const READINESS_PATHS = [
  {
    id: 'ready',
    title: 'Already ready',
    desc: 'If every check passes, choose the local development option and arrive ready for the hands-on work.',
  },
  {
    id: 'setup',
    title: 'Able to install locally',
    desc: 'Choose the local development option and complete the published setup before your first hands-on session.',
  },
  {
    id: 'cloud',
    title: 'Need a managed environment',
    desc: 'Choose the cloud option if local setup is not possible. Capacity is limited, so access is not guaranteed.',
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
    a: 'Dates and start times are still to be announced.',
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
    a: 'You receive access to the event GitHub organization and $100 worth of AI credits to use with GitHub Copilot.',
  },
  {
    q: 'How do I access the GitHub organization?',
    a: 'A few days before the event starts, your event invitation will include the link used to join the organization.',
  },
  {
    q: 'How do I register?',
    a: REGISTRATION_OPEN
      ? 'Provide and confirm your company email, choose your sessions and select your development environment. No GitHub sign-in is required on this website.'
      : 'Registration will open soon. When it does, provide and confirm your company email, choose your sessions and select your development environment.',
  },
]

export const REGISTER_STEPS = [
  'Enter and confirm your company email address',
  'Choose the sessions and development environment you need',
  'Receive the GitHub organization invitation link a few days before the event',
]

export const REGISTRATION = {
  eyebrow: 'Registration',
  title: 'Join the Agentic Software Development Winter Bootcamp.',
  subtitle: 'Confirm your company email, choose your sessions and provide the details needed for event access.',
  slotHelp:
    'These Friday dates and times are placeholders for workflow validation. Session topics are confirmed; final dates and facilitators remain TBC. Select any session times you would attend.',
  environments: [
    {
      id: 'local',
      label: 'I will use a local development environment',
      desc: 'Choose this if your machine already meets the requirements or you will complete the setup yourself.',
    },
    {
      id: 'cloud',
      label: 'I need a cloud development environment',
      desc: 'Managed environments have limited capacity. Selecting this option does not guarantee access.',
    },
  ],
  consent:
    'I consent to Microsoft using my company, company email, session choices and environment preference to administer the bootcamp, send the GitHub organization invitation, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period.',
  success: 'Thanks. Your registration is saved. GitHub organization access details will be sent a few days before the event.',
}

export const REGISTRATION_SOON = {
  eyebrow: 'Registration',
  title: 'Registration will open soon.',
  subtitle: 'The programme is ready and the registration flow is being prepared. Check back soon to choose your dates and sessions.',
  badge: 'Opening soon',
  heading: 'Registration will open soon',
  body: 'All six sessions run on every placeholder date. Once registration opens, you can choose any combination of session times and request the development environment you need.',
  cta: 'Registration opens soon',
}
