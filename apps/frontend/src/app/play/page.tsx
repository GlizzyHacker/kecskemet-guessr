import Card from '@/components/card';
import SelectGame from '@/components/select_game';

export default function Play() {
  return (
    <main className='flex flex-col items-center justify-center'>
      <Card className='p-4'>
        <SelectGame />
      </Card>
    </main>
  );
}
