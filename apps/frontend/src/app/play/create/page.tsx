'use client';

import Button from '@/components/button';
import Checkboxes from '@/components/checkboxes';
import Radio from '@/components/radio';
import useAreas from '@/hooks/useAreas';
import api from '@/lib/api';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Create() {
  const router = useRouter();
  const { data: areas } = useAreas();
  const [showAreaSelection, setShowAreaSelection] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(getAreasForOption('NORMAL') ?? []);

  function getAreasForOption(option: string) {
    let selected;
    switch (option) {
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
    return selected;
  }

  function onPresetArea(preset: 'NORMAL' | 'EXPANDED' | 'ALL'): void {
    setShowAreaSelection(false);
    setSelectedAreas(getAreasForOption(preset) ?? []);
  }

  function onCustomArea(): void {
    setShowAreaSelection(true);
  }

  async function handleForm(formData: FormData) {
    const request = {
      difficulty: formData.get('difficulty'),
      areas: selectedAreas,
      totalRounds: Number(formData.get('rounds')),
      hint: Boolean(formData.get('hint')),
    };
    try {
      const response = await api.post(`/games`, request);
      router.push(`/play/${response.data.id}`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main className='flex flex-col items-5 w-2/3 mx-auto'>
      <div className='flex flex-row bg-secondary rounded-xl p-2'>
        <div className='flex-1'>
          <Map areas={selectedAreas}></Map>
        </div>
        <div className='flex-1 flex flex-col p-8 items-center'>
          <form className='flex flex-col' action={handleForm}>
            <h2 className='font-medium text-white transition px-4 py-2 mx-auto'>Create Game</h2>
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
              <Radio group='area' value='NORMAL' isDefault={true} onSelect={() => onPresetArea('NORMAL')}>
                Nagykörút
              </Radio>
              <Radio group='area' value='EXPANDED' onSelect={() => onPresetArea('EXPANDED')}>
                Külső körutak
              </Radio>
              <Radio group='area' value='ALL' onSelect={() => onPresetArea('ALL')}>
                Egész Kecskemét
              </Radio>
              <Radio group='area' value='OTHER' onSelect={onCustomArea}>
                Egyéb
              </Radio>
            </div>
            {showAreaSelection && areas && (
              <Checkboxes options={[...areas].map((area) => area[0])} selectionChanged={setSelectedAreas} />
            )}
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
            <div className='m-2'>
              <input type='checkbox' id='hint' name='hint' />
              <label className='pl-2' htmlFor='hint'>
                Give area hint
              </label>
            </div>
            <Button className='mx-auto m-2' type='submit'>
              Create Game
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
