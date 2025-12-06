import useAreas from '@/hooks/useAreas';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { ReactNode, useState } from 'react';
import Button from './button';
import Card from './card';
import Checkboxes from './checkboxes';
import ErrorCard from './error_card';
import InputField from './input_field';
import Radio from './radio';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function CreateGame({
  onForm,
  error,
  loading,
  isOnline,
}: {
  onForm: (formData: FormData) => void;
  error?: ReactNode;
  loading?: boolean;
  isOnline?: boolean;
}) {
  const { data: areas } = useAreas();
  const [showAreaSelection, setShowAreaSelection] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(getAreasForOption('NORMAL') ?? []);

  const t = useTranslations('Create');

  function getAreasForOption(option: string) {
    let selected;
    switch (option) {
      case 'NORMAL':
        selected = [
          'Belváros',
          'belső Bethlenváros',
          'Rákócziváros',
          'Erzsébetváros',
          'Kossuthváros',
          'Árpádváros',
          'Máriaváros',
          'Villanegyed',
        ];
        break;
      case 'EXPANDED':
        selected = [
          'Belváros',
          'belső Bethlenváros',
          'Rákócziváros',
          'Erzsébetváros',
          'Kossuthváros',
          'Árpádváros',
          'Máriaváros',
          'Villanegyed',
          'Hunyadiváros',
          'Szent István-város',
          'Muszáj',
          'Szent László-város',
          'belső Alsószéktó',
          'belső Felsőszéktó',
          'Petőfiváros',
          'Vízműdomb',
          'Széchenyiváros',
          'külső Bethlenváros',
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

  return (
    <Card>
      <div className='flex max-md:flex-col rounded-[10] overflow-hidden'>
        <div className='flex-1'>
          <Map areas={selectedAreas} />
        </div>
        <div className='flex-1 flex flex-col px-8 pb-8 items-center'>
          <form
            className='grid grid-cols-2 space-y-2'
            action={(f) => {
              f.set('areas', selectedAreas.join(','));
              onForm(f);
            }}
          >
            <h2 className='font-medium text-xl transition px-4 pb-2 pt-4 col-span-2 mx-auto'>{t('create')}</h2>
            <div className=' max-md:col-span-2'>
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
            <div className=' max-md:col-span-2'>
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
            <div className=' max-md:col-span-2'>
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
            <div className='max-md:col-span-2'>
              <input type='checkbox' id='hint' name='hint' />
              <label className='pl-2' htmlFor='hint'>
                {t('area_hint')}
              </label>
            </div>
            <div className='mx-auto col-span-2'>
              <InputField type='number' name='rounds' defaultValue={5}>
                {t('rounds')}
              </InputField>
            </div>
            {isOnline == true && (
              <div className='mx-auto col-span-2'>
                <InputField type='number' name='members' defaultValue={5}>
                  {t('members')}
                </InputField>
              </div>
            )}
            <Button enable={!loading} className='mx-auto col-span-2 mt-2' type='submit'>
              {t('create')}
            </Button>
            {error && <ErrorCard className='col-span-2'>{error}</ErrorCard>}
          </form>
        </div>
      </div>
    </Card>
  );
}
