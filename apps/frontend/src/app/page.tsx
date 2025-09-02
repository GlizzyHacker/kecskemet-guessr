import Button from '@/components/button';
import SelectGame from '@/components/select_game';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('Home');
  return (
    <main className='max-md:h-full '>
      <div className='h-full flex flex-row justify-center items-center'>
        <div className='h-full md:w-1/2 bg-secondary rounded-xl p-2'>
          <div className='h-full bg-primary flex max-md:flex-col gap-0.5'>
            <div className='flex-1 flex flex-col bg-secondary p-4'>
              <h2 className='pb-2 text-center font-medium text-white'>{t('singleplayer')}</h2>
              <div className='flex-1 items-center flex '>
                <Link className='w-full' href='/play/single'>
                  <Button enable={false} className='w-full'>
                    {t('play')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className='flex-1 bg-secondary p-4'>
              <h2 className='pb-2 text-center font-medium text-white'>{t('multiplayer')}</h2>
              <SelectGame />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
