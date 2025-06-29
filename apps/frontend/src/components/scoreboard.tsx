import { Guess, Member, Round } from '@/types/game';

export default function Scoreboard({ members, currentRound }: { members: Member[]; currentRound: Round }) {
  return (
    <ul>
      {members?.map((member) => (
        <li key={member.id}>
          {member.player.name} {member.connected ? 'connected' : 'disconnected'} score:
          {member.guesses.reduce((sum: number, guess: Guess) => sum + guess.score, 0)}
          {member.guesses.some((guess: Guess) => guess.roundId == currentRound.id) ? 'guessed' : ''}
        </li>
      ))}
    </ul>
  );
}
