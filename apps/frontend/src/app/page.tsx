import Button from '@/components/button';
import Card from '@/components/card';
import SelectGame from '@/components/select_game';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('Home');
  return (
    <main className='max-md:h-full '>
      <div className='h-full flex flex-row justify-center items-center'>
        <Card className='h-full md:w-1/2'>
          <div className='h-full bg-outline-variant flex max-md:flex-col gap-0.5'>
            <div className='flex-1 flex flex-col bg-surface-container-low p-4'>
              <h2 className='pb-2 text-center font-medium'>{t('singleplayer')}</h2>
              <div className='flex-1 items-center flex '>
                <Link className='w-full' href='/play/single'>
                  <Button className='w-full'>{t('play')}</Button>
                </Link>
              </div>
            </div>
            <div className='flex-1 bg-surface-container-low p-4'>
              <h2 className='pb-2 text-center font-medium'>{t('multiplayer')}</h2>
              <SelectGame />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
