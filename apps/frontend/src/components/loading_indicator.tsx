import { useTranslations } from 'next-intl';

export default function LoadingIndicator() {
  const t = useTranslations('LoadingIndicator');
  return <p className='text-center'>{t('loading')}</p>;
}
