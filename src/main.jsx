import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Earlier versions of the site kept these in localStorage, which outlives the visit. The site now
// keeps nothing on the device once the tab closes, so returning visitors' copies are removed.
const LEGACY_STORAGE_KEYS = [
  'deck-navbar-dismissed',
  'winter-bootcamp:prep',
  'agentic-dev-motion',
  'software-winter-bootcamp:code-rain-v1',
  'agentic-software-development-winter-bootcamp:registration-token',
]
for (const key of LEGACY_STORAGE_KEYS) {
  try { localStorage.removeItem(key) } catch { /* storage unavailable */ }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
