import { InlineEditProvider, Navigation, SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import { useState } from 'react'
import '@deckio/deck-engine/styles/editable.css'
import project from '../deck.config.js'

function DeliveryProgress() {
  const { current, totalSlides, visibleIndices = [] } = useSlides()
  const order = visibleIndices.length ? visibleIndices : Array.from({ length: totalSlides }, (_, i) => i)
  const pos = Math.max(0, order.indexOf(current))
  const progress = ((pos + 1) / order.length) * 100
  return (
    <div className="deck-delivery-progress" aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
      {Array.from({ length: 6 }, (_, index) => <i key={index} className={progress >= ((index + 1) / 6) * 100 ? 'is-complete' : ''} />)}
    </div>
  )
}

const NAVBAR_DISMISSED_KEY = 'deck-navbar-dismissed'

function readNavbarDismissed() {
  try { return localStorage.getItem(NAVBAR_DISMISSED_KEY) === '1' } catch { return false }
}

function DeckNavBar() {
  const { go, atStart, atEnd, displayIndex, visibleCount } = useSlides()
  const [dismissed, setDismissed] = useState(readNavbarDismissed)
  if (dismissed) return null
  const dismiss = () => {
    try { localStorage.setItem(NAVBAR_DISMISSED_KEY, '1') } catch { /* storage unavailable */ }
    setDismissed(true)
  }
  // Pointer clicks blur the button so the engine's arrow-key handler (which ignores focused buttons) keeps working.
  const step = (e, dir) => {
    go(dir)
    if (e.detail > 0) e.currentTarget.blur()
  }
  return (
    <nav className="deck-navigation" aria-label="Slide navigation">
      <button type="button" className="deck-side-arrow deck-side-previous" onClick={(e) => step(e, -1)} disabled={atStart} aria-label="Previous slide">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m14 6-6 6 6 6" />
        </svg>
      </button>
      <div className="deck-navbar">
        <div className="deck-navbar-status">
          <span className="deck-navbar-count" aria-live="polite">Slide {displayIndex + 1} of {visibleCount}</span>
          <span className="deck-navbar-hint deck-navbar-hint-keys">Use the arrows or keyboard</span>
          <span className="deck-navbar-hint deck-navbar-hint-touch">Tap the arrows or swipe</span>
        </div>
        <button type="button" className="deck-navbar-close" onClick={dismiss} aria-label="Hide slide navigation" title="Hide (swipe and arrow keys still work)">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <button type="button" className="deck-side-arrow deck-side-next" onClick={(e) => step(e, 1)} disabled={atEnd} aria-label="Next slide">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m10 6 6 6-6 6" />
        </svg>
      </button>
    </nav>
  )
}

export default function DeckView() {
  const { id, slides, theme } = project
  return (
    <InlineEditProvider overrides={{}} project={id}>
      <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme}>
        <Navigation />
        <DeliveryProgress />
        <div className="deck" data-project-id={id}>
          {slides.map((SlideComponent, index) => (
            <SlideErrorBoundary key={`${id}-slide-${index}`} index={index}>
              <SlideComponent index={index} project={project} />
            </SlideErrorBoundary>
          ))}
        </div>
        <DeckNavBar />
      </SlideProvider>
    </InlineEditProvider>
  )
}
