// Shared public content for the landing site and the deck.
// Topics, speakers and dates intentionally remain visible placeholders.

export const BOOTCAMP = {
  name: 'Agentic Software Development Winter Bootcamp',
  short: 'Winter Bootcamp',
  tagline: 'Build software with agents across the complete delivery loop.',
  subtitle:
    'A six-session community programme exploring how GitHub Copilot supports intent, implementation, quality, review, delivery and learning.',
  season: 'Winter',
  kickoffDate: null,
  kickoffLabel: 'Dates to be announced',
  kickoff: null,
  footer: 'Agentic Software Development Winter Bootcamp',
}

const ACCENTS = ['#79c7ff', '#a8a0ff', '#f0b86e', '#63d9b1', '#7ca7ff', '#e59bc3']

export const SESSIONS = Array.from({ length: 6 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return {
    id: `session-${number}`,
    number,
    title: '[Session topic TBC]',
    shortTitle: `Session ${number}`,
    track: 'Topic TBC',
    subtitle: 'Session details will be added when the programme is confirmed.',
    owner: '[Owner TBC]',
    ownerInitials: 'TBC',
    audience: 'Software community',
    format: 'Format TBC',
    scheduleMark: `S${index + 1}`,
    accent: ACCENTS[index],
    spotlight: 'The session focus and hands-on challenge will be announced.',
    overview:
      'This placeholder reserves a complete session in the programme. The confirmed description, examples, prerequisites and practical activity will be added here.',
    outcomes: [
      'Learning outcomes TBC',
      'Hands-on activity TBC',
      'Tools and prerequisites TBC',
    ],
    tools: ['Tools TBC'],
  }
})

export const PERSONAS = [
  {
    id: 'developers', icon: '{ }', label: 'Software developers',
    desc: 'From intent and architecture to implementation and review.',
    does: 'Use agents as collaborators while keeping design choices, code quality and accountability with the engineering team.',
    stack: ['Issues', 'Specs', 'Code', 'Tests', 'Pull requests'],
  },
  {
    id: 'quality', icon: 'QA', label: 'Quality engineers',
    desc: 'Make expected behaviour, evidence and risk visible.',
    does: 'Turn acceptance criteria into executable checks and use agents to expand coverage without lowering the quality bar.',
    stack: ['Acceptance criteria', 'Tests', 'Security', 'Review'],
  },
  {
    id: 'platform', icon: '∞', label: 'Platform & engineering teams',
    desc: 'Connect repositories, CI, delivery and production learning.',
    does: 'Give agents safe, observable paths through the delivery system while teams retain control of release decisions.',
    stack: ['GitHub', 'CI/CD', 'Cloud', 'Telemetry'],
  },
]

export const TEAM = [
  {
    id: 'nathan',
    name: 'Nathan Brahmbhatt',
    initials: 'NB',
    role: 'Host',
    focus: 'Bootcamp host and programme coordination',
    accent: '#79c7ff',
  },
  {
    id: 'owners',
    name: 'To be announced',
    initials: 'TBC',
    role: 'Session owners',
    focus: 'Owners for the six programme sessions will be published when confirmed',
    accent: '#63d9b1',
  },
]

export const PILLARS = [
  {
    id: 'whole-loop',
    icon: '01',
    title: 'Practise the whole delivery loop',
    desc: 'Connect issues, specifications, code, tests, reviews, releases and production feedback.',
  },
  {
    id: 'evidence',
    icon: '02',
    title: 'Evidence over output',
    desc: 'Ask agents for reviewable plans, focused diffs, executable checks and visible delivery signals.',
  },
  {
    id: 'community',
    icon: '03',
    title: 'Built for the broader community',
    desc: 'Relevant to developers, testers, architects, platform teams and engineering leaders.',
  },
]

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

export const PREP = [
  { id: 'github', icon: 'GH', title: 'GitHub account ready', desc: 'Use the GitHub identity you want associated with registration and workshop activity.' },
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
    a: 'The broader software development community: developers, testers, architects, platform engineers, engineering leaders and adjacent roles.',
  },
  {
    q: 'What are the session topics?',
    a: 'The programme will contain six sessions. Topics and detailed outcomes are still being confirmed and will be published here.',
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
    a: 'Yes, where possible. Each confirmed session will publish its prerequisites and hands-on format before registration closes.',
  },
  {
    q: 'How do I register?',
    a: 'Sign in with GitHub, provide the event details needed for administration and select the sessions you plan to attend.',
  },
]

export const REGISTER_STEPS = [
  'Sign in with your personal GitHub.com account',
  'Confirm the sessions you plan to attend and add your company details',
  'Receive setup guidance and access information by email',
]

export const REGISTRATION = {
  eyebrow: 'Registration',
  title: 'Join the Agentic Software Development Winter Bootcamp.',
  subtitle: 'Sign in with GitHub, confirm your sessions and provide the details needed for event access.',
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
    'I consent to Microsoft using my company, company email, session choices, GitHub.com username and environment preference to administer the bootcamp, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period.',
}
