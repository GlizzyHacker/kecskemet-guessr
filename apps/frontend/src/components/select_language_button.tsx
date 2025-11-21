'use client';

import { useLocale } from 'next-intl';

export default function SelectLanguageButton() {
  const locale = useLocale();
  const nextLocale = locale === 'en' ? 'hu' : 'en';

  async function changeLanguage() {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    window.location.reload();
  }
  return (
    <button className='hover:cursor-pointer' onClick={() => changeLanguage()}>
      {nextLocale.toUpperCase()}
    </button>
  );
}
