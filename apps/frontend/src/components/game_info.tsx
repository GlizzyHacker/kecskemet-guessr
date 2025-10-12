import { Game } from '@/types/game';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import Card from './card';
import JoinCode from './join_code';

export default function GameInfo({ className = '', game }: { className?: string; game: Game }) {
  const t = useTranslations('GameInfo');
  const topt = useTranslations('Create');
  const [open, setOpen] = useState(false);

  return (
    <Card className={`${className}`}>
      <div className='m-3 space-x-3 flex'>
        <h1 className='flex-1 font-medium text-lg text-center'>{t('round', { round: game.round, rounds: game.totalRounds })}</h1>
        <button className='md:hidden' onClick={() => setOpen(!open)}>
          <FaChevronUp className={`transition-all duration-300 ${open ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <div
        className={`${open ? 'max-md:max-h-100' : 'max-md:max-h-0'} overflow-hidden transition-all duration-300 grid grid-cols-4`}
      >
        <div className='p-2 max-md:col-span-4 md:text-center'>
          <JoinCode code={game.joinCode} />
        </div>
        <p className='p-2 max-md:col-span-4 md:text-center'>
          {t('difficulty')}: {topt(game.difficulty.toLowerCase())}
        </p>{' '}
        <p className='p-2 max-md:col-span-4 md:text-center'>
          {t('timer')}: {topt('limit', { minute: game.timer / 60 })}
        </p>
        <p className='p-2 max-md:col-span-4 md:text-center'>
          {t('members')}: {game.memberLimit}
        </p>
        {game.rounds[game.round - 1]?.image.area && (
          <p className='p-2 max-md:col-span-4 md:text-center'>
            {t('hint')}: {game.rounds[game.round - 1]?.image.area}
          </p>
        )}
        <p className='p-2 col-span-4'>
          {t('area')}: {game.area.split(',').join(', ')}
        </p>
      </div>
    </Card>
  );
}
