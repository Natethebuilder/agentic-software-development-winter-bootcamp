import { InlineEditProvider, Navigation, SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import '@deckio/deck-engine/styles/editable.css'
import project from '../deck.config.js'
import { useEffect, useState } from 'react'
import RegistrationForm from './registration/RegistrationForm.jsx'
import { MotionToggle } from './theme/WinterGrid.jsx'

function DeliveryProgress() {
  const { current, totalSlides, visibleIndices = [] } = useSlides()
  const order = visibleIndices.length ? visibleIndices : Array.from({ length: totalSlides }, (_, index) => index)
  const position = Math.max(0, order.indexOf(current))
  const progress = ((position + 1) / order.length) * 100
  const labels = ['ISSUE', 'SPEC', 'CODE', 'PR', 'CI', 'PROD']

  return (
    <div className="delivery-progress" aria-hidden="true">
      <div className="delivery-track"><i style={{ width: `${progress}%` }} /></div>
      <div className="delivery-labels">
        {labels.map((label, index) => (
          <span className={progress >= ((index + 1) / labels.length) * 100 ? 'is-active' : ''} key={label}>
            <b />{label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function DeckView({ motion, onToggleMotion }) {
  const { id, slides, theme } = project
  const [registrationOpen, setRegistrationOpen] = useState(false)

  useEffect(() => {
    const openRegistration = () => setRegistrationOpen(true)
    window.addEventListener('deck:open-registration', openRegistration)

    const url = new URL(window.location.href)
    if (url.searchParams.get('register') === '1') {
      setRegistrationOpen(true)
      url.searchParams.delete('register')
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }

    return () => window.removeEventListener('deck:open-registration', openRegistration)
  }, [])

  useEffect(() => {
    if (!registrationOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setRegistrationOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [registrationOpen])

  return (
    <InlineEditProvider overrides={{}} project={id}>
      <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme}>
        <div className="deck-chrome">
          <a href="#/">← Website</a>
          <button type="button" onClick={() => setRegistrationOpen(true)}>Register</button>
          <MotionToggle enabled={motion} onToggle={onToggleMotion} />
        </div>
        <Navigation />
        <DeliveryProgress />
        <div className="deck" data-project-id={id}>
          {slides.map((SlideComponent, index) => (
            <SlideErrorBoundary key={`${id}-slide-${index}`} index={index}>
              <SlideComponent index={index} project={project} />
            </SlideErrorBoundary>
          ))}
        </div>
        {registrationOpen && (
          <div className="deck-registration-backdrop" role="presentation" onMouseDown={() => setRegistrationOpen(false)}>
            <div className="deck-registration-modal" role="dialog" aria-modal="true" aria-labelledby="deck-registration-title" onMouseDown={(event) => event.stopPropagation()}>
              <div className="deck-registration-header">
                <div>
                  <span>GitHub-authenticated registration</span>
                  <h2 id="deck-registration-title">Reserve your place.</h2>
                </div>
                <button type="button" aria-label="Close registration" onClick={() => setRegistrationOpen(false)}>×</button>
              </div>
              <RegistrationForm postLoginRedirect="/?register=1#/deck" />
            </div>
          </div>
        )}
      </SlideProvider>
    </InlineEditProvider>
  )
}
