'use client';

import Button from '@/components/button';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Create() {
  const router = useRouter();

  async function handleForm() {
    try {
      const response = await api.post(`/games`, {});
      const json = response.data;
      console.log(json);
      router.push(`/play/${json.id}`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main className='flex flex-col items-center justify-center'>
      <div className='bg-secondary flex flex-col p-10 rounded-xl'>
        <form className='flex flex-col' action={handleForm}>
          <div>
            <input type='radio' id='easy' name='difficulty' value='easy' />
            <label htmlFor='easy'>Normal</label>
            <input type='radio' id='normal' name='difficulty' value='normal' />
            <label htmlFor='normal'>Hard</label>
            <input type='radio' id='hard' name='difficulty' value='hard' />
            <label htmlFor='hard'>Impossible</label>
          </div>
          <div>
            <label htmlFor='guesses'>Number of guesses</label>
            <input type='number' id='guesses' name='guesses' className='bg-primary flex rounded-xl p-2'  />
          </div>
          <Button className='mx-auto' type='submit'>
            Create Game
          </Button>
        </form>
      </div>
    </main>
  );
}
