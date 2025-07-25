'use client';

import usePlayer from '@/hooks/usePlayer';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from './button';
import ErrorCard from './error_card';

export default function CreatePlayer() {
  const { data: player } = usePlayer();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('CreatePlayer');

  async function handleCreatePlayer(formData: FormData) {
    const name = formData.get('name')!.toString();
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { name: name });
      router.push(response.data.url);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.data?.message) {
          setError(e.response.data.message.join(', '));
        } else {
          setError(e.message);
        }
      }
      console.log(e);
    }
  }

  async function handleRenamePlayer(formData: FormData) {
    const name = formData.get('name')!.toString();
    try {
      await api.patch(`${process.env.NEXT_PUBLIC_API_URL}/players/me`, { name: name });
      router.refresh();
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.data?.message) {
          setError(e.response.data.message.join(', '));
        } else {
          setError(e.message);
        }
      }
      console.log(e);
    }
  }

  return (
    <div>
      {!player && (
        <form action={handleCreatePlayer} className='bg-secondary p-2'>
          <label htmlFor='name'>{t('name')}:</label>
          <input
            id='name'
            name='name'
            type='text'
            placeholder='Prób András'
            className='bg-primary flex rounded-xl p-2'
          />
          <br />
          <Button type='submit'>{t('create')}</Button>
        </form>
      )}
      {player && (
        <form action={handleRenamePlayer} className='bg-secondary flex flex-col p-2 rounded-xl '>
          <input
            id='name'
            name='name'
            type='text'
            defaultValue={player!.name}
            className='bg-primary flex rounded-xl p-2'
          />
          <br />
          <Button type='submit' className='mx-auto'>
            {t('rename')}
          </Button>
          {error && <ErrorCard className='m-2'>{error}</ErrorCard>}
        </form>
      )}
    </div>
  );
}
