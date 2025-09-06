import { Guess, Member, Round } from '@/types/game';
import { useTranslations } from 'next-intl';
import { FaCrown } from 'react-icons/fa';
import Card from './card';

export default function Scoreboard({
  className = '',
  members,
  currentRound,
}: {
  className?: string;
  members: Member[];
  currentRound: Round | null;
}) {
  const t = useTranslations('Scoreboard');
  const sorted = members.toSorted(
    (a, b) =>
      b.guesses.reduce((sum: number, guess: Guess) => sum + (guess.roundId == currentRound?.id ? 0 : guess.score), 0) -
      a.guesses.reduce((sum: number, guess: Guess) => sum + (guess.roundId == currentRound?.id ? 0 : guess.score), 0)
  );

  return (
    <Card className={className}>
      <div className='w-full grid grid-cols-6 gap-y-0.5 bg-secondary'>
        <p className='bg-primary text-center p-2 overflow-ellipsis'>{t('ranking')}</p>
        <p className='col-span-2 bg-primary text-center p-2 overflow-ellipsis'>{t('name')}</p>
        <p className='col-span-2 bg-primary text-center p-2 overflow-ellipsis'>{t('score')}</p>
        <p className='bg-primary text-center p-2 overflow-hidden'>{t('guessed')}</p>
        {sorted?.map((member, i) => [
          <p key={`${member.id}rank`} className='bg-primary text-center p-2'>{`${i + 1}.`}</p>,
          <p key={`${member.id}name`} className='col-span-2 bg-primary text-center p-2 overflow-ellipsis'>
            {member.connected && member.isOwner && <FaCrown className='inline align-baseline mx-1' />}
            {member.player.name}
          </p>,
          <p key={`${member.id}score`} className='col-span-2 bg-primary text-center p-2'>
            {member.guesses.reduce((sum: number, guess: Guess) => sum + guess.score, 0)}
          </p>,
          <p key={`${member.id}guess`} className='bg-primary text-center p-2 overflow-ellipsis'>
            {member.connected
              ? member.guesses.some((guess: Guess) => guess.roundId == currentRound?.id)
                ? 'X'
                : ''
              : t('left')}
          </p>,
        ])}
      </div>
    </Card>
  );
}
