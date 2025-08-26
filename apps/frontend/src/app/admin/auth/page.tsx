'use client';

import Button from '@/components/button';
import ErrorCard from '@/components/error_card';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Auth() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(formData: FormData) {
    const password = formData.get('password')!.toString();
    try {
      const response = await api.patch(`${process.env.NEXT_PUBLIC_API_URL}/auth/elevate`, { password: password });
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
  return (
    <main className='flex flex-col items-center'>
      <form action={handleLogin} className='bg-secondary flex flex-col p-2 rounded-xl'>
        <input id='password' name='password' type='password' className='bg-primary rounded-xl p-2' />
        <br />
        <Button type='submit' className='mx-auto'>
          Try
        </Button>
        {error && <ErrorCard className='m-2'>{error}</ErrorCard>}
      </form>
    </main>
  );
}
