'use client';

import usePlayer from '@/hooks/usePlayer';
import Link from 'next/link';
import Button from './button';

export default function LoginButton() {
  const { data: player } = usePlayer();

  if (player) {
    return (
      <Link className='text-white' href={'/player'}>
        {player.name}
      </Link>
    );
  }

  return (
    <Link href={'/player'}>
      <Button>Create player</Button>
    </Link>
  );
}
