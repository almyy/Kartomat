import {
  ActionIcon,
  Menu,
  Image,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSettings, IconMoon, IconSun } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const languages = [
  {
    value: "nb",
    label: "Norsk",
    image: `${import.meta.env.BASE_URL}flags/nb.svg`,
  },
  {
    value: "en",
    label: "English",
    image: `${import.meta.env.BASE_URL}flags/en.svg`,
  },
];

export function SettingsMenu() {
  const { t, i18n } = useTranslation();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const languageItems = languages.map((lang) => (
    <Menu.Item
      key={lang.value}
      leftSection={<Image src={lang.image} width={18} height={18} alt="" />}
      onClick={async () => {
        await i18n.changeLanguage(lang.value);
      }}
    >
      {lang.label}
    </Menu.Item>
  ));

  return (
    <Menu radius="md" withinPortal position="bottom-end">
      <Menu.Target>
        <ActionIcon
          variant="default"
          size="xl"
          radius="md"
          aria-label={t("settings.menu")}
        >
          <IconSettings className="w-6 h-6" stroke={1.5} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t("settings.theme")}</Menu.Label>
        <Menu.Item
          leftSection={
            computedColorScheme === "light" ? (
              <IconSun className="w-4 h-4" stroke={1.5} />
            ) : (
              <IconMoon className="w-4 h-4" stroke={1.5} />
            )
          }
          onClick={() =>
            setColorScheme(computedColorScheme === "light" ? "dark" : "light")
          }
        >
          {computedColorScheme === "light"
            ? t("language.label") === "Language"
              ? "Light"
              : "Lys"
            : t("language.label") === "Language"
              ? "Dark"
              : "Mørk"}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>{t("settings.language")}</Menu.Label>
        {languageItems}
      </Menu.Dropdown>
    </Menu>
  );
}
