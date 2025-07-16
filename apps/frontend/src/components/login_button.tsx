'use client';

import usePlayer from '@/hooks/usePlayer';
import Link from 'next/link';

export default function LoginButton() {
  const { data: player } = usePlayer();

  return (
    <Link className='text-white' href='/player'>
      {player ? player.name : 'Create player'}
    </Link>
  );
}
