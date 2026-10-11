import { useEffect, useState } from 'react'
import DeckView from './DeckView.jsx'
import Site from './site/Site.jsx'
import WinterGrid, { useMotionPreference } from './theme/WinterGrid.jsx'
import project from '../deck.config.js'

function useHashRoute() {
  const readRoute = () => (window.location.hash.startsWith('#/deck') ? 'deck' : 'site')
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const updateRoute = () => setRoute(readRoute())
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  return route
}

export default function App() {
  const route = useHashRoute()
  const [motion, setMotion] = useMotionPreference()

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', project.accent)
    document.title = route === 'deck' ? `${project.title} · Deck` : project.title
  }, [route])

  return (
    <>
      <WinterGrid enabled={motion} density={route === 'deck' ? 0.55 : 1} />
      {route === 'deck'
        ? <DeckView motion={motion} onToggleMotion={() => setMotion((value) => !value)} />
        : <Site motion={motion} onToggleMotion={() => setMotion((value) => !value)} />}
    </>
  )
}
