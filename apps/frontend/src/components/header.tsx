'use client';
import Link from 'next/link';
import LoginButton from './login_button';
import SelectLanguageButton from './select_language_button';

export default function Header() {

  return (
    <header className='bg-secondary-container text-on-secondary-container overflow-hidden'>
      <div className='flex flex-row container mx-auto items-center justify-between'>
        <Link href='/'>
          <h1 className='font-medium text-xl transition px-4 py-2'>Kecskemét Guessr</h1>
        </Link>

        <div className='items-center space-x-4 h-full p-2'>
          <LoginButton />
          <SelectLanguageButton/>
        </div>
      </div>
    </header>
  );
}
