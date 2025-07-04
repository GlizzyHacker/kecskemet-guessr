import { Game } from '@/types/game';
import Card from './card';

export default function GameInfo({ className = '', game }: { className?: string; game: Game }) {
  return (
    <Card className={`${className} flex flex-row`}>
      <p className='p-2'>Game id: {game.id}</p>
      <p className='p-2'>Round: {game.round}</p>
    </Card>
  );
}
