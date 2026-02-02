import { useTranslation } from 'react-i18next'
import type { ChangeEvent } from 'react'

export function LanguageSelector() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-sm font-medium">
        {t('language.label')}:
      </label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={handleLanguageChange}
        className="px-3 py-1.5 rounded border text-inherit text-sm cursor-pointer border-gray-300 bg-white/90 dark:border-white/20 dark:bg-black/30"
      >
        <option value="nb">{t('language.nb')}</option>
        <option value="en">{t('language.en')}</option>
      </select>
    </div>
  )
}
