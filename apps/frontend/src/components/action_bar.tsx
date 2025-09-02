import { GamePhase } from '@/types/game';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import Button from './button';

export default function ActionBar({
  phase,
  children,
  onAction,
}: {
  phase: GamePhase;
  children: ReactNode;
  onAction: (phase: GamePhase) => void;
}) {
  const t = useTranslations('ActionBar');

  let text;
  switch (phase) {
    case GamePhase.START:
      text = t('start');
      break;
    case GamePhase.GUESSING:
      text = t('guessing');
      break;
    case GamePhase.GUESSED:
      text = t('guessed');
      break;
    case GamePhase.REVEAL:
      text = t('reveal');
      break;
    case GamePhase.DISCONNECTED:
      text = t('disconnected');
      break;
    case GamePhase.END:
      text = t('end');
      break;

    default:
      break;
  }
  let button;
  switch (phase) {
    case GamePhase.START:
      button = t('start_button');
      break;
    case GamePhase.GUESSING:
      button = t('guessing_button');
      break;
    case GamePhase.GUESSED:
      button = t('guessing_button');
      break;
    case GamePhase.REVEAL:
      button = t('reveal_button');
      break;
    case GamePhase.DISCONNECTED:
      button = t('disconnected_button');
      break;
    case GamePhase.END:
      button = t('end_button');
      break;

    default:
      break;
  }

  return (
    <div className=' bg-secondary rounded-xl p-2 w-full flex items-center space-x-2'>
      <p className='flex-1 ml-2'>{text}</p>
      <div className='flex max-md:flex-col items-center'>
        <div className='min-w-14 m-2'>{children}</div>
        <Button onClick={() => onAction(phase)} enable={phase != GamePhase.GUESSED}>
          {button}
        </Button>
      </div>
    </div>
  );
}
