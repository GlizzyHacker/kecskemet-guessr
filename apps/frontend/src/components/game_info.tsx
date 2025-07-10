import { Game } from '@/types/game';
import Card from './card';

export default function GameInfo({ className = '', game }: { className?: string; game: Game }) {
  return (
    <Card className={`${className}`}>
      <h1 className='text-center p-3'>
        Round {game.round} out of {game.totalRounds}
      </h1>
      <div className=''>
        {game.rounds[game.round - 1]?.image.area && (
          <p className='p-2'>Hint: {game.rounds[game.round - 1]?.image.area}</p>
        )}
        <p className='p-2'>Game id: {game.id}</p>
        <p className='p-2'>Difficulty: {game.difficulty}</p>
        <p className='p-2'>Area: {game.area.split(',').join(', ')}</p>
        <p className='p-2'>Szétütöm a fejed gaydácsi</p>
      </div>
    </Card>
  );
}
