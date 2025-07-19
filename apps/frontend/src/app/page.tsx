import Button from '@/components/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('Home');
  return (
    <main>
      <div className='flex flex-row justify-center items-center'>
        <div>
          <Link href='/play'>
            <Button>{t('play')}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
