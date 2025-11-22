import { Guess, Member, Round } from '@/types/game';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaBan, FaCrown } from 'react-icons/fa';
import Button from './button';
import ScoreCounter from './score_counter';

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
    <motion.li
      layout
      transition={{ duration: 1, ease: 'easeInOut' }}
      className=' bg-outline-variant will-change-transform pt-0.5'
    >
      <div className='bg-surface-container-low flex items-end gap-2 py-2'>
          {onKick && (
            <Button icon enable={member.connected} className='absolute align-baseline' onClick={() => onKick?.()}>
              <FaBan className='text-primary' />
            </Button>
          )}
        <p className='flex-1 text-center'>
          {`${placement + 1}.`}
        </p>
        <p className='flex-2 text-center overflow-ellipsis'>
          {member.connected && member.isOwner && <FaCrown className='inline align-baseline mx-1' />}
          {member.player.name}
        </p>
        <div className='flex-2 text-center'>
          <ScoreCounter score={member.guesses.reduce((sum: number, guess: Guess) => sum + guess.score, 0)} />
        </div>
        <p className='flex-1 overflow-ellipsis text-center'>
          {member.connected
            ? member.guesses.some((guess: Guess) => guess.roundId == currentRound?.id)
              ? 'X'
              : ''
            : t('left')}
        </p>
      </div>
    </motion.li>
  );
}
