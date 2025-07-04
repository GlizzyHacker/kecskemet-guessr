import Button from '@/components/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className='flex flex-row justify-center items-center'>
        <div>
          <Link href='/play'>
            <Button>Play</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
