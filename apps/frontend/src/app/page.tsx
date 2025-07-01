import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className='flex flex-row justify-center items-center'>
      <div className='bg-primary outline-tertiary items-center mx-auto flex rounded-xl p-2 mt-2'>
        <Link href='/play'>Play</Link>
      </div></div>
    </main>
  );
}
