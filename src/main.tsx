import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { migrateLocalStorage } from './utils/migration'

// Run migrations before app starts
migrateLocalStorage()

// Initialize theme from localStorage or default
const initializeTheme = () => {
  try {
    const stored = localStorage.getItem('kartomat-storage')
    if (stored) {
      const state = JSON.parse(stored)
      const theme = state.state?.theme || 'dark'
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // Default to dark theme
      document.documentElement.classList.add('dark')
    }
  } catch {
    // Default to dark theme on error
    document.documentElement.classList.add('dark')
  }
}

initializeTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
