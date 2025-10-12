import Card from '@/components/card';
import CreatePlayer from '@/components/create_player';

export default function Player() {
  return (
    <div className='flex flex-row justify-center items-center'>
      <Card>
        <CreatePlayer />
      </Card>
    </div>
  );
}
