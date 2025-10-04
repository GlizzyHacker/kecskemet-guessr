'use client';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from './button';
import ErrorCard from './error_card';
import InputField from './input_field';

export default function SelectGame() {
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();
  const t = useTranslations('SelectGame');

  function handleForm(formData: FormData) {
    handleJoinGame(String(formData.get('gameId')!));
  }
  async function handleCreateGame() {
    router.push('/play/create');
  }
  async function handleJoinGame(joinCode: string) {
    try {
      const response = await api.get(`/games/${joinCode}`);
      const json = response.data;
      joinGame(json.joinCode);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setError(e.message);
        if (e.status == 401) {
          router.push(`/play/${joinCode}`);
        }
      }
      console.log(e);
    }
  }

  function joinGame(joinCode: string) {
    router.push(`/play/${joinCode}`);
  }

  return (
    <div className='flex flex-col rounded-xl '>
      <Button onClick={handleCreateGame} className=''>
        {t('create')}
      </Button>
      <div className='h-0.5 my-4 bg-outline-variant' />
      <form action={handleForm} className='flex flex-col gap-2'>
        <InputField name='gameId' type='text'>
          {t('id')}
        </InputField>
        <Button type='submit' className=''>
          {t('join')}
        </Button>
        {error && <ErrorCard>{error}</ErrorCard>}
      </form>
    </div>
  );
}
