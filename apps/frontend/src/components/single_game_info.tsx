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
    <div className='p-2 max-md:col-span-3 text-lg'>
      {tScore('score')}:{' '}
      <ScoreCounter
        score={game.rounds.map((round) => round.guesses[0]?.score ?? 0).reduce((prev, cur) => prev + cur, 0)}
      />
    </div>
  );

  return (
    <Card className={`${className}`}>
      <div className='m-3 space-x-3 flex align-center'>
        <div className='md:hidden'>{score}</div>
        <h1 className='flex-1 font-medium text-lg text-center my-auto'>
          {t('round', { round: Math.min(game.round, game.totalRounds), rounds: game.totalRounds })}
        </h1>
        <button className='md:hidden' onClick={() => setOpen(!open)}>
          <FaChevronUp className={`transition-all duration-300 ${open ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <div
        className={`${open ? 'max-md:max-h-100' : 'max-md:max-h-0'} overflow-hidden transition-all duration-300 grid max-md:grid-cols-1 grid-cols-3`}
      >
        <div className='max-md:hidden mx-auto min-w-50 w-min'>{score}</div>
        <p className='p-2 md:text-center'>
          {t('timer')}: {topt('limit', { minute: game.timer / 60 })}
        </p>
        <p className='p-2 md:text-center'>
          {t('difficulty')}: {topt(game.difficulty.toLowerCase())}
        </p>
        {game.rounds[game.round - 1]?.image.area && (
          <p className='p-2 md:text-center'>
            {t('hint')}: {game.rounds[game.round - 1]?.image.area}
          </p>
        )}
        <p className='p-2 flex flex-wrap items-center col-span-3 md:mx-20'>
          {game.area.split(',').map((area) => (
            <div className='m-1 px-2 py-1 rounded-2xl bg-secondary-container text-on-secondary-container' key={area}>
              {area}
            </div>
          ))}
        </p>
      </div>
    </Card>
  );
}
