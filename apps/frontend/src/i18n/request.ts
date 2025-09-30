import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const defaultLocale = (await headers()).get("accept-language")?.split(",")[0];
  const locale = (await cookies()).get("NEXT_LOCALE")?.value || defaultLocale || "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
