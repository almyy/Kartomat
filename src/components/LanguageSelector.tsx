import { useTranslation } from 'react-i18next'
import { NativeSelect, HStack, Text } from '@chakra-ui/react'
import type { ChangeEvent } from 'react'

export function LanguageSelector() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <HStack gap={2}>
      <Text fontSize="sm" fontWeight="medium">
        {t('language.label')}:
      </Text>
      <NativeSelect.Root size="sm">
        <NativeSelect.Field
          value={i18n.language}
          onChange={handleLanguageChange}
        >
          <option value="nb">{t('language.nb')}</option>
          <option value="en">{t('language.en')}</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </HStack>
  )
}
