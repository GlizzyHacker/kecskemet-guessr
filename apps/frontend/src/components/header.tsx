'use client';
import Link from 'next/link';
import LoginButton from './login_button';

export default function Header() {
  const links = [{ href: '/rules', title: 'Szabályzat' }];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const commonHeaderItems = (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href} title={link.title} />
      ))}
    </>
  );

  return (
    <header className='bg-secondary-container text-on-secondary-container overflow-hidden'>
      <div className='flex flex-row container mx-auto items-center justify-between'>
        <Link href='/'>
          <h1 className='font-medium text-xl transition px-4 py-2'>Kecskemét Guessr</h1>
        </Link>

        <div className='items-center gap-2 h-full p-2'>
          {/*commonHeaderItems*/}
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
