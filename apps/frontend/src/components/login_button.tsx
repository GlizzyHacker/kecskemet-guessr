'use client';

import usePlayer from '@/hooks/usePlayer';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function LoginButton() {
  const t = useTranslations('LoginButton');
  const { data: player } = usePlayer();

  return (
    <Link className='' href='/player'>
      {player ? player.name : t('create')}
    </Link>
  );
}
