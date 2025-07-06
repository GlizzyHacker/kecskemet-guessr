import { Guess, Member, Round } from '@/types/game';
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
  return (
    <Card className={className}>
      <div className='grid grid-cols-4 gap-y-0.5 bg-secondary'>
        <p className='bg-primary text-center p-2'>Name</p>
        <p className='bg-primary text-center p-2'>Status</p>
        <p className='bg-primary text-center p-2'>Score</p>
        <p className='bg-primary text-center p-2'>Guessed</p>
        {members?.map((member) => [
          <p key={`${member.id}name`} className='bg-primary text-center p-2'>
            {member.player.name}
          </p>,
          <p key={`${member.id}conn`} className='bg-primary text-center p-2'>
            {member.connected ? 'connected' : 'disconnected'}
          </p>,
          <p key={`${member.id}score`} className='bg-primary text-center p-2'>
            {member.guesses.reduce((sum: number, guess: Guess) => sum + guess.score, 0)}
          </p>,
          <p key={`${member.id}guess`} className='bg-primary text-center p-2'>
            {member.guesses.some((guess: Guess) => guess.roundId == currentRound?.id) ? 'X' : ''}
          </p>,
        ])}
      </div>
    </Card>
  );
}
