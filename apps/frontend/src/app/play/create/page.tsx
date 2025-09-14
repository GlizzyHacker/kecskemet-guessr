'use client';

import CreateGame from '@/components/create_game';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Create() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleForm(formData: FormData) {
    setLoading(true);
    const request = {
      difficulty: formData.get('difficulty'),
      areas: String(formData.get('areas')).split(','),
      timer: Number(formData.get('timer')),
      totalRounds: Number(formData.get('rounds')),
      hint: Boolean(formData.get('hint')),
    };
    try {
      const response = await api.post(`/games`, request);
      router.push(`/play/${response.data.id}`);
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
    setLoading(false);
  }

  return (
    <main className='flex flex-col items-5 min-w-2/3 mx-auto'>
      <CreateGame onForm={handleForm} error={error} loading={loading} />
    </main>
  );
}
