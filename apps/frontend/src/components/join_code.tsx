import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';

export default function JoinCode({ code }: { code: string }) {
  const t = useTranslations('JoinCode');
  const [loading, setLoading] = useState(false);

  async function handleShare() {
    setLoading(true);
    await navigator.share({
      title: 'Kecskemét Guessr',
      text: t('share_message'),
      url: window.location.href,
    });
    setLoading(false);
  }
  return (
    <div>
      <p>{t('join_code')}:</p>
      <p className=''>
        {code}
        <button
          className='ml-2 enabled:cursor-pointer disabled:opacity-30 inline align-baseline'
          disabled={loading}
          onClick={handleShare}
        >
          <FaShareAlt />
        </button>
      </p>
    </div>
  );
}
