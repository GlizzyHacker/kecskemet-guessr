import CreatePlayer from '@/components/create_player';

export default function Player() {
  return (
    <div className='flex flex-row justify-center items-center'>
      <div className='bg-secondary p-8 rounded-xl'>
        <CreatePlayer />
      </div>
    </div>
  );
}
