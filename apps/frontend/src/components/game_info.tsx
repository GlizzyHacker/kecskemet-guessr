import { Game } from '@/types/game';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaChevronUp, FaShareAlt } from 'react-icons/fa';
import Card from './card';

export default function GameInfo({ className = '', game }: { className?: string; game: Game }) {
  const t = useTranslations('GameInfo');
  const topt = useTranslations('Create');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleShare() {
    setLoading(true);
    await navigator.share({
      title: 'Kecskemét Guessr',
      text: t('share_message'),
      url: window.location.href,
    });
    setLoading(false);
  }

  return (
    <Card className={`${className}`}>
      <div className='m-3 flex'>
        <h1 className='flex-1 text-center'>{t('round', { round: game.round, rounds: game.totalRounds })}</h1>
        <button className='enabled:cursor-pointer disabled:opacity-30' disabled={loading} onClick={handleShare}>
          <FaShareAlt />
        </button>
        <button className='md:hidden' onClick={() => setOpen(!open)}>
          <FaChevronUp className={`transition-all duration-300 ${open ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <div
        className={`${open ? 'max-md:max-h-100' : 'max-md:max-h-0'} overflow-hidden transition-all duration-300 grid grid-cols-3`}
      >
        <p className='p-2 max-md:col-span-3 md:text-center'>
          {t('id')}: {game.id}
        </p>
        <p className='p-2 max-md:col-span-3 md:text-center'>
          {t('timer')}: {topt('limit', { minute: game.timer / 60 })}
        </p>
        <p className='p-2 max-md:col-span-3 md:text-center'>
          {t('difficulty')}: {topt(game.difficulty.toLowerCase())}
        </p>{' '}
        {game.rounds[game.round - 1]?.image.area && (
          <p className='p-2 max-md:col-span-3 md:text-center'>
            {t('hint')}: {game.rounds[game.round - 1]?.image.area}
          </p>
        )}
        <p className='p-2 col-span-3'>
          {t('area')}: {game.area.split(',').join(', ')}
        </p>
      </div>
    </Card>
  );
}
