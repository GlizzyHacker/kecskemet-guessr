import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from "next/headers";

const supportedLocales = ["en", "hu"];

export default getRequestConfig(async () => {
  const acceptedLocales = (await headers()).get("accept-language")?.split(",");
  const locale = (await cookies()).get("NEXT_LOCALE")?.value || acceptedLocales.filter((locale) => supportedLocales.contains(locale))[0] || "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
