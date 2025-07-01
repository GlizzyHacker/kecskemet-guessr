import { Guess, Member, Round } from '@/types/game';

export default function Scoreboard({ members, currentRound }: { members: Member[]; currentRound: Round }) {
  return (
    <div className='flex h-min rounded-xl m-4 bg-secondary'>
      <div className=' h-min rounded-xl m-2 p-4 bg-primary'>
        <div className='grid grid-cols-4 gap-y-0.5 h-min  bg-secondary'>
          <p className='bg-primary p-2'>Name</p>
          <p className='bg-primary p-2'>Status</p>
          <p className='bg-primary p-2'>Score</p>
          <p className='bg-primary p-2'>Guessed</p>
          {members?.map((member) => [
            <p className='bg-primary p-2'>{member.player.name}</p>,
            <p className='bg-primary p-2'>{member.connected ? 'connected' : 'disconnected'}</p>,
            <p className='bg-primary p-2'>
              {member.guesses.reduce((sum: number, guess: Guess) => sum + guess.score, 0)}
            </p>,
            <p className='bg-primary p-2'>
              {member.guesses.some((guess: Guess) => guess.roundId == currentRound.id) ? 'X' : ''}
            </p>,
          ])}
        </div>
      </div>
    </div>
  );
}
