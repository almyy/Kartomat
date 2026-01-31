import { useStore } from '../store'
import type { Theme } from '../store/themeSlice'

export function ThemeToggle() {
  const theme = useStore((state) => state.theme)
  const setTheme = useStore((state) => state.setTheme)

  const cycleTheme = () => {
    const themes: Theme[] = ['system', 'light', 'dark']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      case 'system':
        return '💻'
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 border border-gray-400 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 rounded transition-colors"
      aria-label="Toggle theme"
      title={`Current theme: ${getLabel()}. Click to change.`}
    >
      <span className="flex items-center gap-2">
        <span>{getIcon()}</span>
        <span className="hidden sm:inline">{getLabel()}</span>
      </span>
    </button>
  )
}
