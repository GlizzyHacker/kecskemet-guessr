import { GamePhase } from '@/types/game';
import { useTranslations } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import Ad from './ad';
import Button from './button';
import Card from './card';

export default function ActionBar({
  phase,
  children,
  onAction,
}: {
  phase: GamePhase;
  children?: ReactNode;
  onAction: (phase: GamePhase) => void;
}) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    //DEFAULT TO LOADING TO AVOID FLASHING WHEN SWITCHING TO REVEAL
    setLoading(true);
    if (phase == GamePhase.REVEAL) {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [phase]);

  const t = useTranslations('ActionBar');

  let text, button;
  switch (phase) {
    case GamePhase.START:
      text = t('start');
      button = t('start_button');
      break;
    case GamePhase.GUESSING:
      text = t('guessing');
      button = t('guessing_button');
      break;
    case GamePhase.GUESSED:
      text = t('guessed');
      button = t('guessing_button');
      break;
    case GamePhase.REVEAL:
      text = t('reveal');
      button = t('reveal_button');
      break;
    case GamePhase.DISCONNECTED:
      text = t('disconnected');
      button = t('disconnected_button');
      break;
    case GamePhase.END:
      text = t('end');
      button = t('end_button');
      break;
    default:
      break;
  }

  return (
    <Card className=' w-full'>
      <div className='flex items-center space-x-2'>
        <p className='flex-1 ml-2'>{text}</p>
        <div className='flex max-md:flex-col items-center'>
          {children && <div className='min-w-14 m-2'>{children}</div>}
          <Button
            className=''
            onClick={() => onAction(phase)}
            enable={!(loading && phase == GamePhase.REVEAL) && phase != GamePhase.GUESSED}
          >
            {button}
          </Button>
        </div>
      </div>
      <Ad />
    </Card>
  );
}
