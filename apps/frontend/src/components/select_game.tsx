'use client';
import api from '@/lib/api';
import { Game } from '@/types/game';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Button from './button';

export default function SelectGame() {
  const router = useRouter();
  const t = useTranslations('SelectGame');

  function handleForm(formData: FormData) {
    handleJoinGame(Number(formData.get('gameId')!));
  }
  async function handleCreateGame() {
    router.push('/play/create');
  }
  async function handleJoinGame(gameId: number) {
    try {
      const response = await api.get(`/games/${gameId}`);
      const json = response.data;
      joinGame(json);
    } catch (e) {
      console.log(e);
    }
  }

  function joinGame(game: Game) {
    router.push(`/play/${game.id}`);
  }

  return (
    <div className='bg-secondary flex flex-col p-10 rounded-xl '>
      <Button onClick={handleCreateGame} className='mx-auto'>
        {t('create')}
      </Button>
      <br />
      <form action={handleForm} className='mt-4 flex flex-col'>
        <label htmlFor='gameId'>{t('id')}:</label>
        <input name='gameId' type='number' className='bg-primary flex rounded-xl p-2' />
        <Button type='submit' className='mx-auto mt-2'>
          {t('join')}
        </Button>
      </form>
    </div>
  );
}
