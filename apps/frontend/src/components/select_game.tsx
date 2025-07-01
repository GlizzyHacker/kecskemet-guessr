'use client';
import api from '@/lib/api';
import { Game } from '@/types/game';
import { useRouter } from 'next/navigation';

export default function SelectGame() {
  const router = useRouter();

  function handleForm(formData: FormData) {
    handleJoinGame(Number(formData.get('gameId')!));
  }
  async function handleCreateGame() {
    try {
      const response = await api.post(`/games`, {});
      const json = response.data;
      console.log(json);
      joinGame(json);
    } catch (e) {
      console.log(e);
    }
  }
  async function handleJoinGame(gameId: number) {
    try {
      const response = await api.get(`/games/${gameId}`);
      const json = response.data;
      console.log(json);
      joinGame(json);
    } catch (e) {
      console.log(e);
    }
  }

  function joinGame(game: Game) {
    router.push(`/play/${game.id}`);
  }

  return (
    <div className='bg-secondary p-10 rounded-xl '>
      <button
        onClick={handleCreateGame}
        className='bg-primary outline-tertiary items-center mx-auto flex rounded-xl p-2'
      >
        Create game
      </button>
      <br />
      <form action={handleForm} className='mt-4'>
        <label htmlFor='gameId'>Game id:</label>
        <input name='gameId' type='number' className='bg-primary flex rounded-xl p-2' />
        <button type='submit' className='bg-primary outline-tertiary items-center mx-auto flex rounded-xl p-2 mt-2'>
          Join game
        </button>
      </form>
    </div>
  );
}
