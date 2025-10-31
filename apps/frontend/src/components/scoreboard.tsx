import { Guess, Member, Round } from '@/types/game';
import { useTranslations } from 'next-intl';
import Card from './card';
import ScoreboardItem from './scoreboard_item';

export default function Scoreboard({
  className = '',
  members,
  currentRound,
  onKick,
}: {
  className?: string;
  members: Member[];
  currentRound?: Round;
  onKick?: (member: Member) => void;
}) {
  const t = useTranslations('Scoreboard');

  const sorted = members.toSorted(
    (a, b) =>
      b.guesses.reduce((sum: number, guess: Guess) => sum + guess.score, 0) -
      a.guesses.reduce((sum: number, guess: Guess) => sum + guess.score, 0)
  );

  return (
    <Card className={className}>
      <div className='w-full grid grid-cols-6 bg-outline-variant'>
        <p className='bg-surface-container-low text-center p-2 overflow-ellipsis'>{t('ranking')}</p>
        <p className='col-span-2 bg-surface-container-low text-center p-2 overflow-ellipsis'>{t('name')}</p>
        <p className='col-span-2 bg-surface-container-low text-center p-2 overflow-ellipsis'>{t('score')}</p>
        <p className='bg-surface-container-low text-center p-2 overflow-hidden'>{t('guessed')}</p>
        <div className='col-span-6'>
          {sorted?.map((member, i) => [
            <ScoreboardItem
              key={member.id}
              member={member}
              placement={i}
              currentRound={currentRound}
              onKick={onKick == undefined ? undefined : async () => onKick(member)}
            />,
          ])}
        </div>
      </div>
    </Card>
  );
}
