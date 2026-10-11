import { InlineEditProvider, Navigation, SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import '@deckio/deck-engine/styles/editable.css'
import project from '../deck.config.js'
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
  return (
    <InlineEditProvider overrides={{}} project={id}>
      <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme}>
        <div className="deck-chrome">
          <a href="#/">← Website</a>
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
      </SlideProvider>
    </InlineEditProvider>
  )
}
