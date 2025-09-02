import SelectGame from '@/components/select_game';

export default function Play() {
  return (
    <main className='flex flex-col items-center justify-center'>
      <div className='p-4 rounded-xl bg-secondary'>
        <SelectGame />
      </div>
    </main>
  );
}
