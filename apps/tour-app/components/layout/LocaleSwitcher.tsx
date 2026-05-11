"use client";

import { MenuItem, Select, Stack } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, LOCALE_LABELS } from "@/constants/locales";
import { radiusTokens } from "@/theme/tokens";
import { languageFlagIcons } from "@/components/layout/language-flag-icons";

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const localeNames: Record<string, string> = {
    tr: "Türkçe",
    en: "English",
    de: "Deutsch",
    ru: "Русский",
    fr: "Français",
    cs: "Čeština",
    sk: "Slovenčina",
  };
  const flag = (locale: string) => {
    const FlagIcon =
      languageFlagIcons[locale as keyof typeof languageFlagIcons];

    return FlagIcon ? (
      <FlagIcon
        width={20}
        height={20}
        style={{ marginRight: 6, flex: "0 0 auto" }}
      />
    ) : null;
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end">
      <Select
        size="small"
        value={currentLocale}
        onChange={(event) =>
          router.replace(pathname, { locale: event.target.value })
        }
        aria-label={tCommon("language")}
        sx={{
          minWidth: 118,
          bgcolor: "rgba(255,255,255,0.96)",
          borderRadius: `${radiusTokens.lg}px`,

          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            py: 1.2,
            pl: 1.5,
            fontSize: 13,
            fontWeight: 800,
          },
          "& fieldset": { borderColor: "rgba(207,220,232,0.86)" },
        }}
      >
        {LOCALES.map((locale) => (
          <MenuItem key={locale} value={locale}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              {flag(locale)}
              {localeNames[locale] ?? LOCALE_LABELS[locale]}
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
