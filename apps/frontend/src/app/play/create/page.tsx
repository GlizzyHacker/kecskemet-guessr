'use client';

import Button from '@/components/button';
import Radio from '@/components/radio';
import useAreas from '@/hooks/useAreas';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Create() {
  const router = useRouter();
  const { data: areas } = useAreas();

  async function handleForm(formData: FormData) {
    let selected;
    switch (formData.get('area')) {
      case 'NORMAL':
        selected = ['Nagykorut'];
        break;
      case 'EXPANDED':
        selected = [
          'Nagykorut',
          'Mariavaros',
          'Mukertvaros',
          'Szechenyivaros+hollandfalu',
          'Domb',
          'Szentlaszlo+rendorfalu',
          'Egyetem+Beketer+deliiparterulet',
          'Bethlenvaros',
          'Hunyadivaros',
          'Szentistvan',
          'Petofivaros',
        ];
        break;
      case 'ALL':
        selected = Array.from(areas!, (v) => v[1]).map((area) => area.properties.Name);
    }
    const request = {
      difficulty: formData.get('difficulty'),
      areas: selected,
      totalRounds: Number(formData.get('rounds')),
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
          <Button className='mx-auto m-2' type='submit'>
            Create Game
          </Button>
        </form>
      </div>
    </main>
  );
}
