import { useEffect } from 'react'
import DeckView from './DeckView.jsx'
import Snowfall from './winter/Snowfall.jsx'
import project from '../deck.config.js'

export default function App() {
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', project.accent)
    document.title = project.title
    const showDeck = () => {
      if (!window.location.hash.startsWith('#/deck')) {
        const url = new URL(window.location.href)
        url.hash = '#/deck'
        window.history.replaceState(window.history.state, '', url)
      }
    }
    showDeck()
    window.addEventListener('hashchange', showDeck)
    return () => window.removeEventListener('hashchange', showDeck)
  }, [])

  return (
    <>
      <Snowfall density={0.6} />
      <DeckView />
    </>
  )
}
