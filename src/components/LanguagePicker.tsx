import { useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import {Group, Image, Menu, UnstyledButton} from '@mantine/core'
import {useTranslation} from "react-i18next";

const data = [
  { value: 'nb', label: 'Norsk', image: `${import.meta.env.BASE_URL}flags/nb.svg` },
  { value: 'en', label: 'English', image: `${import.meta.env.BASE_URL}flags/en.svg` },
]

export function LanguagePicker() {
  const { i18n } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(data[0]);
  const items = data.map((item) => (
      <Menu.Item
          key={item.label}
          leftSection={<Image src={item.image} width={18} height={18} alt="" />}
          onClick={async () => {
              setSelected(item)
              await i18n.changeLanguage(item.value)
            }
          }
      >
        {item.label}
      </Menu.Item>
  ));

  return (
      <Menu
          onOpen={() => setOpened(true)}
          onClose={() => setOpened(false)}
          radius="md"
          width="target"
          withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className="w-52! flex! justify-between! items-center! px-3! py-2! rounded-md! border! border-gray-200! dark:border-dark-600! transition-colors! duration-150! bg-white! dark:bg-dark-600! hover:bg-gray-50! dark:hover:bg-dark-500! data-expanded:bg-gray-50! dark:data-expanded:bg-dark-500!"
            data-expanded={opened || undefined}
          >
            <Group gap="xs">
              <Image src={selected.image} w={22} h={22} alt="" />
              <span className="font-medium text-sm">{selected.label}</span>
            </Group>
            <IconChevronDown
              size={16}
              className={`transition-transform duration-150 ${opened ? 'rotate-180' : 'rotate-0'}`}
              stroke={1.5}
            />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
      </Menu>
  );
}