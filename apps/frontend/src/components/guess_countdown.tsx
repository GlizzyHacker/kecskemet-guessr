import { Game } from '@/types/game';
import Countdown, { CountdownRenderProps } from 'react-countdown';

export default function GuessCountdown({ game }: { game: Game }) {
  if (!game?.rounds[game.round - 1]) {
    return;
  }
  return (
    <Countdown
      key={game.round}
      date={Date.parse(game.rounds[game.round - 1].createdAt) + game.timer * 1000}
      renderer={(props: CountdownRenderProps) => (
        <p className='text-center tabular-nums'>{`${props.minutes < 10 ? '0' : ''}${props.minutes}:${props.seconds < 10 ? '0' : ''}${props.seconds}`}</p>
      )}
    />
  );
}
