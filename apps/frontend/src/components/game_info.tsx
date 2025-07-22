import { Game } from '@/types/game';
import { useTranslations } from 'next-intl';
import Card from './card';

export default function GameInfo({ className = '', game }: { className?: string; game: Game }) {
  const t = useTranslations('GameInfo');
  const topt = useTranslations('Create');
  return (
    <Card className={`${className}`}>
      <h1 className='text-center p-3'>{t('round', { round: game.round, rounds: game.totalRounds })}</h1>
      <div className=''>
        {game.rounds[game.round - 1]?.image.area && (
          <p className='p-2'>
            {t('hint')}: {game.rounds[game.round - 1]?.image.area}
          </p>
        )}
        <p className='p-2'>
          {t('id')}: {game.id}
        </p>
        <p className='p-2'>
          {t('timer')}: {topt('limit', { minute: game.timer / 60 })}
        </p>
        <p className='p-2'>
          {t('difficulty')}: {topt(game.difficulty.toLowerCase())}
        </p>
        <p className='p-2'>
          {t('area')}: {game.area.split(',').join(', ')}
        </p>
      </div>
    </Card>
  );
}
