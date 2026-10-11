import {
  TitleSlide,
  CommunitySlide,
  LifecycleSlide,
  WorkflowSlide,
  SessionOverviewSlide,
  sessionSlides,
  PrepareSlide,
  RegistrationSlide,
  ClosingSlide,
} from './src/slides/Slides.jsx'

export default {
  id: 'agentic-software-development-winter-bootcamp',
  title: 'Agentic Software Development Winter Bootcamp',
  subtitle: 'GitHub Copilot across the software development lifecycle.',
  description: 'A six-session community bootcamp about building software with AI agents and human judgement.',
  icon: '</>',
  accent: '#7ee7ff',
  theme: 'dark',
  appearance: 'dark',
  order: 1,
  slides: [
    TitleSlide,
    CommunitySlide,
    LifecycleSlide,
    WorkflowSlide,
    SessionOverviewSlide,
    ...sessionSlides,
    PrepareSlide,
    RegistrationSlide,
    ClosingSlide,
  ],
}
