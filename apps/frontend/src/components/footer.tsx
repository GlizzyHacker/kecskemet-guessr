'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className='bg-secondary-container text-on-secondary-container p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 w-full container mx-auto gap-4 items-center'>
        <div className='flex gap-2 justify-center lg:justify-start items-center'>
          {t('contact')}:
          <Link href='mailto:saxattila@gmail.com' target='_blank' className='flex items-center'>
            saxattila@gmail.com
          </Link>
        </div>
        <p className='text-sm text-center lg:text-right '>{t('created_by', { first: 'Attila', last: 'Sax' })}</p>
      </div>
    </footer>
  );
}
