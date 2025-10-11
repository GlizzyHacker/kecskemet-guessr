import Button from '@/components/button';
import Card from '@/components/card';
import SelectGame from '@/components/select_game';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('Home');
  return (
    <main className='h-full flex flex-col'>
      <div className='flex flex-row justify-center items-center'>
        <Card className='h-full md:w-1/2 max-md:w-full'>
          <div className='h-full bg-outline-variant flex max-md:flex-col gap-0.5'>
            <div className='flex-1 flex flex-col bg-surface-container-low p-4'>
              <h2 className='pb-2 text-center font-medium text-xl'>{t('singleplayer')}</h2>
              <div className='flex-1 items-center flex '>
                <Link className='w-full' href='/play/single'>
                  <Button className='w-full'>{t('play')}</Button>
                </Link>
              </div>
            </div>
            <div className='flex-1 bg-surface-container-low p-4'>
              <h2 className='pb-2 text-center font-medium text-xl'>{t('multiplayer')}</h2>
              <SelectGame />
            </div>
          </div>
        </Card>
      </div>
      <div className='flex max-md:flex-col py-8 gap-4 flex-grow'>
        <Card className='flex-1'>
          <h2 className='font-medium text-xl px-4 pb-2 pt-4 text-center'>{t('about_title')}</h2>
          {t('about')
            .split('\n')
            .map((line, i) => (
              // warning is a false positive because this array wont change
              // eslint-disable-next-line react/no-array-index-key
              <p key={'a' + i} className='px-4 pb-4 whitespace-pre-wrap'>
                {line}
              </p>
            ))}
        </Card>
        <Card className='flex-1'>
          <h2 className='font-medium text-xl px-4 pb-2 pt-4 text-center'>{t('how_to_play_title')}</h2>
          {t('how_to_play')
            .split('\n')
            .map((line, i) => (
              // warning is a false positive because this array wont change
              // eslint-disable-next-line react/no-array-index-key
              <p key={'h' + i} className='px-4 pb-4 whitespace-pre-wrap'>
                {line}
              </p>
            ))}
        </Card>
      </div>
    </main>
  );
}
