'use client';

import Button from '@/components/button';
import Checkboxes from '@/components/checkboxes';
import ErrorCard from '@/components/error_card';
import Radio from '@/components/radio';
import useAreas from '@/hooks/useAreas';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
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

  const t = useTranslations('Create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getAreasForOption(option: string) {
    let selected;
    switch (option) {
      case 'NORMAL':
        selected = [
          'belváros',
          'belső bethlenváros',
          'rákócziváros',
          'erzsébetváros',
          'kossuthváros',
          'árpádváros',
          'máriaváros',
          'villanegyed',
        ];
        break;
      case 'EXPANDED':
        selected = [
          'belváros',
          'belső bethlenváros',
          'rákócziváros',
          'erzsébetváros',
          'kossuthváros',
          'árpádváros',
          'máriaváros',
          'villanegyed',
          'hunyadiváros',
          'szent istván-város',
          'muszáj',
          'szent lászló-város',
          'belső alsószéktó',
          'vízmű és egyetem',
          'petőfiváros',
          'domb',
          'széchenyiváros',
          'külső bethlenváros',
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
    setLoading(true);
    const request = {
      difficulty: formData.get('difficulty'),
      areas: selectedAreas,
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
      <div className='flex flex-row bg-secondary rounded-xl p-2'>
        <div className='flex-1'>
          <Map areas={selectedAreas} />
        </div>
        <div className='flex-1 flex flex-col px-8 pb-8 items-center'>
          <form className='grid grid-cols-2 space-y-2' action={handleForm}>
            <h2 className='font-medium text-white transition px-4 pb-2 pt-4 col-span-2 mx-auto'>Create Game</h2>
            <div>
              <h2>{t('difficulty')}</h2>
              <div className='pl-2'>
                <Radio group='difficulty' value='EASY' isDefault>
                  {t('easy')}
                </Radio>
                <Radio group='difficulty' value='NORMAL'>
                  {t('normal')}
                </Radio>
                <Radio group='difficulty' value='HARD'>
                  {t('hard')}
                </Radio>
              </div>
            </div>
            <div>
              <h2>{t('area')}</h2>
              <div className='pl-2'>
                <Radio group='area' value='NORMAL' isDefault onSelect={() => onPresetArea('NORMAL')}>
                  {t('grand_boulevard')}
                </Radio>
                <Radio group='area' value='EXPANDED' onSelect={() => onPresetArea('EXPANDED')}>
                  {t('urban_areas')}
                </Radio>
                <Radio group='area' value='ALL' onSelect={() => onPresetArea('ALL')}>
                  {t('all')}
                </Radio>
                <Radio group='area' value='OTHER' onSelect={onCustomArea}>
                  {t('other')}
                </Radio>
              </div>
            </div>
            {showAreaSelection && areas && (
              <div className='grid grid-cols-2 col-span-2 '>
                <Checkboxes options={[...areas].map((area) => area[0])} selectionChanged={setSelectedAreas} />
              </div>
            )}
            <div>
              <h2>{t('timer')}</h2>
              <div className='pl-2'>
                <Radio group='timer' value='0' isDefault>
                  {t('limit', { minute: 0 })}
                </Radio>
                <Radio group='timer' value='60'>
                  {t('limit', { minute: 1 })}
                </Radio>
                <Radio group='timer' value='120'>
                  {t('limit', { minute: 2 })}
                </Radio>
              </div>
            </div>
            <div>
              <input type='checkbox' id='hint' name='hint' />
              <label className='pl-2' htmlFor='hint'>
                {t('area_hint')}
              </label>
            </div>
            <div className='mx-auto col-span-2'>
              <label htmlFor='rounds'>{t('rounds')}</label>
              <input
                type='number'
                id='rounds'
                name='rounds'
                defaultValue={5}
                className='bg-primary flex rounded-xl p-2'
              />
            </div>
            <Button enable={!loading} className='mx-auto col-span-2 mt-2' type='submit'>
              {t('create')}
            </Button>
            {error && <ErrorCard className='col-span-2'>{error}</ErrorCard>}
          </form>
        </div>
      </div>
    </main>
  );
}
