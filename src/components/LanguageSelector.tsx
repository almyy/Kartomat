import { useTranslation } from 'react-i18next'
import { Select, Text } from '@mantine/core'

export function LanguageSelector() {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <Text size="sm" fw={500}>
        {t('language.label')}:
      </Text>
      <Select
        value={i18n.language}
        onChange={(value) => value && i18n.changeLanguage(value)}
        data={[
          { value: 'nb', label: t('language.nb') },
          { value: 'en', label: t('language.en') }
        ]}
        size="xs"
        w={120}
        allowDeselect={false}
      />
    </div>
  )
}
