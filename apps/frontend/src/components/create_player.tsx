'use client';

import usePlayer from '@/hooks/usePlayer';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CreatePlayer() {
  const { data: player } = usePlayer();
  const router = useRouter();

  async function handleCreatePlayer(formData: FormData) {
    const name = formData.get('name')!.toString();
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { name: name });
      router.push(response.data.url);
    } catch (e) {
      console.log(e);
    }
  }
  async function handleRenamePlayer(formData: FormData) {
    const name = formData.get('name')!.toString();
    try {
      const response = await api.patch(`${process.env.NEXT_PUBLIC_API_URL}/players/me`, { name: name });
      router.refresh();
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='flex flex-row justify-center items-center'>
      {!player && (
        <form action={handleCreatePlayer} className='bg-secondary p-10 rounded-xl '>
          <label htmlFor='name'>Name:</label>
          <input
            id='name'
            name='name'
            type='text'
            placeholder='Prób András'
            className='bg-primary flex rounded-xl p-2'
          />
          <br />
          <button type='submit' className='bg-primary outline-tertiary items-center mx-auto flex rounded-xl p-2'>
            Create player
          </button>
        </form>
      )}
      {player && (
        <form action={handleRenamePlayer} className='bg-secondary p-10 rounded-xl '>
          <input
            id='name'
            name='name'
            type='text'
            defaultValue={player!.name}
            className='bg-primary flex rounded-xl p-2'
          />
          <br />
          <button type='submit' className='bg-primary outline-tertiary items-center mx-auto flex rounded-xl p-2'>
            Rename
          </button>
        </form>
      )}
    </div>
  );
}
