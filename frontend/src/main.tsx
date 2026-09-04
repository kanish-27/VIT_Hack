import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { ExplainModal } from './components/ExplainModal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <App />
      <ExplainModal />
    </AccessibilityProvider>
  </StrictMode>,
)

