import { GamePhase } from '@/types/game';
import Button from './button';

export default function ActionBar({ phase, onAction }: { phase: GamePhase; onAction: (phase: GamePhase) => void }) {
  let text;
  switch (phase) {
    case GamePhase.START:
      text = "Press 'Start' to start the game";
      break;
    case GamePhase.GUESSING:
      text = 'Select on the map where the image on the left is shot from';
      break;
    case GamePhase.GUESSED:
      text = 'Waiting for other players to guess';
      break;
    case GamePhase.REVEAL:
      text = "Anwer revealed. Press 'Next' to begin next round";
      break;
    case GamePhase.DISCONNECTED:
      text = 'You have been disconnected from the game';
      break;
    case GamePhase.END:
      text = 'Game has ended';
      break;

    default:
      break;
  }
  let button;
  switch (phase) {
    case GamePhase.START:
      button = 'Start';
      break;
    case GamePhase.GUESSING:
      button = 'Guess';
      break;
    case GamePhase.GUESSED:
      button = 'Guess';
      break;
    case GamePhase.REVEAL:
      button = 'Next';
      break;
    case GamePhase.DISCONNECTED:
      button = 'Reconnect';
      break;
    case GamePhase.END:
      button = 'Leave';
      break;

    default:
      break;
  }

  return (
    <div className=' bg-secondary rounded-xl p-2 w-full flex items-center'>
      <p className='flex-1 ml-2'>{text}</p>
      <Button onClick={() => onAction(phase)} enable={phase != GamePhase.GUESSED}>
        {button}
      </Button>
    </div>
  );
}
