'use client';

import Button from '@/components/button';
import Radio from '@/components/radio';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Create() {
  const router = useRouter();

  async function handleForm(formData: FormData) {
    const request = {
      difficulty: formData.get('difficulty'),
      area: formData.get('area'),
      totalRounds: Number(formData.get('rounds')),
      guesses: Number(formData.get('guesses')),
    };
    try {
      const response = await api.post(`/games`, request);
      router.push(`/play/${response.data.id}`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main className='flex flex-col items-center justify-center'>
      <div className='bg-secondary flex flex-col p-10 rounded-xl'>
        <form className='flex flex-col' action={handleForm}>
          <h2 className='font-medium text-white transition px-4 py-2 mx-auto '>Create Game</h2>
          <div className='m-2'>
            <Radio group='difficulty' value='EASY' isDefault={true}>
              Normal
            </Radio>
            <Radio group='difficulty' value='NORMAL'>
              Hard
            </Radio>
            <Radio group='difficulty' value='HARD'>
              Impossible
            </Radio>
          </div>
          <div className='m-2'>
            <Radio group='area' value='NORMAL' isDefault={true}>
              Nagykörút
            </Radio>
            <Radio group='area' value='EXPANDED'>
              Nagykörút + 2km
            </Radio>
            <Radio group='area' value='ALL'>
              Egész Kecskemét
            </Radio>
          </div>
          <div className='mx-auto m-2'>
            <label htmlFor='rounds'>Number of rounds</label>
            <input
              type='number'
              id='rounds'
              name='rounds'
              defaultValue={5}
              className='bg-primary flex rounded-xl p-2'
            />
          </div>
          <div className='mx-auto m-2'>
            <label htmlFor='guesses'>Number of guesses</label>
            <input
              type='number'
              id='guesses'
              name='guesses'
              defaultValue={1}
              className='bg-primary flex rounded-xl p-2'
            />
          </div>
          <Button className='mx-auto m-2' type='submit'>
            Create Game
          </Button>
        </form>
      </div>
    </main>
  );
}
