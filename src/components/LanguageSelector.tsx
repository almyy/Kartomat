import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronDown } from '@tabler/icons-react'
import { Group, Image, Menu, UnstyledButton } from '@mantine/core'
import classes from './LanguageSelector.module.css'

const data = [
  { value: 'nb', label: 'Norsk', image: `${import.meta.env.BASE_URL}flags/nb.svg` },
  { value: 'en', label: 'English', image: `${import.meta.env.BASE_URL}flags/en.svg` },
]

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const [opened, setOpened] = useState(false)
  const [selected, setSelected] = useState(data[0])

  // Sync selected language with i18n current language
  useEffect(() => {
    const current = data.find((item) => item.value === i18n.language)
    if (current) {
      setSelected(current)
    }
  }, [i18n.language])

  const items = data.map((item) => (
    <Menu.Item
      leftSection={<Image src={item.image} w={18} h={18} alt="" />}
      onClick={() => {
        setSelected(item)
        i18n.changeLanguage(item.value)
      }}
      key={item.value}
    >
      {item.label}
    </Menu.Item>
  ))

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            <Image src={selected.image} w={22} h={22} alt="" />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  )
}
