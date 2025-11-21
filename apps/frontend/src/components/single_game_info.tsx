import { Game } from '@/types/game';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import Card from './card';
import ScoreCounter from './score_counter';

export default function SingleGameInfo({ className = '', game }: { className?: string; game: Game }) {
  const t = useTranslations('GameInfo');
  const tScore = useTranslations('Scoreboard');
  const topt = useTranslations('Create');
  const [open, setOpen] = useState(false);

  const score = (
    <div className='p-2 max-md:col-span-3 w-min min-w-50'>
      {tScore('score')}:{' '}
      <ScoreCounter
        score={game.rounds.map((round) => round.guesses[0]?.score ?? 0).reduce((prev, cur) => prev + cur, 0)}
      />
    </div>
  );

  return (
    <Card className={`${className}`}>
      <div className='m-3 space-x-3 flex'>
        <h1 className='flex-1 text-center'>{t('round', { round: game.round, rounds: game.totalRounds })}</h1>
        <button className='md:hidden' onClick={() => setOpen(!open)}>
          <FaChevronUp className={`transition-all duration-300 ${open ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <div className='md:hidden mx-auto w-min'>{score}</div>
      <div
        className={`${open ? 'max-md:max-h-100' : 'max-md:max-h-0'} overflow-hidden transition-all duration-300 grid grid-cols-3`}
      >
        <p className='p-2 max-md:col-span-3 md:text-center'>
          {t('timer')}: {topt('limit', { minute: game.timer / 60 })}
        </p>
        <p className='p-2 max-md:col-span-3 md:text-center'>
          {t('difficulty')}: {topt(game.difficulty.toLowerCase())}
        </p>
        <div className='max-md:hidden min-w mx-auto'>{score}</div>
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
