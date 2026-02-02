import { useTranslation } from 'react-i18next'
import type { ChangeEvent } from 'react'
import { useStore } from '../store'

export function ThemeSelector() {
  const { t } = useTranslation()
  const theme = useStore((state) => state.theme)
  const setTheme = useStore((state) => state.setTheme)

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as 'light' | 'dark')
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm font-medium">
        {t('theme.label')}:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleThemeChange}
        className="px-3 py-1.5 rounded border text-inherit text-sm cursor-pointer border-gray-300 bg-white/90 dark:border-white/20 dark:bg-black/30"
      >
        <option value="light">{t('theme.light')}</option>
        <option value="dark">{t('theme.dark')}</option>
      </select>
    </div>
  )
}
