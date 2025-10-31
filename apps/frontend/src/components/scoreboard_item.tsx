import { Guess, Member, Round } from '@/types/game';
import { useTranslations } from 'next-intl';
import { FaBan, FaCrown } from 'react-icons/fa';
import Button from './button';

export default function ScoreboardItem({
  member,
  currentRound,
  placement,
  onKick,
}: {
  member: Member;
  currentRound?: Round;
  placement: number;
  onKick?: () => {};
}) {
  const t = useTranslations('Scoreboard');

  return (
    <div className='bg-surface-container-low flex items-end gap-2 py-2 mt-0.5'>
      <p className='flex-1 text-center'>
        {onKick && (
          <Button icon enable={member.connected} className='inline align-baseline' onClick={() => onKick?.()}>
            <FaBan className='text-primary' />
          </Button>
        )}
        {`${placement + 1}.`}
      </p>
      <p className='flex-2 text-center overflow-ellipsis'>
        {member.connected && member.isOwner && <FaCrown className='inline align-baseline mx-1' />}
        {member.player.name}
      </p>
      <p className='flex-2 text-center'>
        {member.guesses.reduce((sum: number, guess: Guess) => sum + guess.score, 0)}
      </p>
      <p className='flex-1 overflow-ellipsis'>
        {member.connected
          ? member.guesses.some((guess: Guess) => guess.roundId == currentRound?.id)
            ? 'X'
            : ''
          : t('left')}
      </p>
    </div>
  );
}
