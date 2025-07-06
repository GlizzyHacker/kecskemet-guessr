'use client';

import Button from '@/components/button';
import Card from '@/components/card';
import GameInfo from '@/components/game_info';
import Scoreboard from '@/components/scoreboard';
import useGame from '@/hooks/useGame';
import useGameConnection from '@/hooks/useGameConnection';
import usePlayer from '@/hooks/usePlayer';
import { ParsedCordinates } from '@/types/game';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play() {
  const [guess, setGuess] = useState<ParsedCordinates | null>(null);
  const { data: player } = usePlayer();
  const params = useParams();
  const { id } = params;
  const { data: initialGame, error: error } = useGame(Number(id));
  const { gameState, answer, isConnected, sendNext, sendGuess } = useGameConnection(initialGame, player);

  function handleGuess() {
    if (guess) {
      sendGuess(guess);
    }
  }

  function handleNext() {
    sendNext();
  }

  const game = gameState ?? initialGame;
  const currentRound = game?.rounds[game.round - 1] ?? null;
  const guessed = game?.members
    .find((member) => member.player.id == player?.id)
    ?.guesses.some((guess) => guess.roundId == currentRound?.id);

  if (game?.active === false) {
    return (
      <div className='flex flex-col items-center space-y-2'>
        <Card className=''>Game is over</Card>
        <Scoreboard members={game.members} currentRound={currentRound} />
      </div>
    );
  }

  return !game ? (
    <div className='flex flex-col items-center space-y-2'>
      <Card>
        <p>Joining game</p>
      </Card>
    </div>
  ) : (
    <main className='flex flex-col items-center justify-center w-full'>
      <div className='flex w-full pb-4 space-x-2'>
        <GameInfo className='flex-1 h-full' game={game} />
        <Scoreboard className='flex-1 h-full' members={game.members} currentRound={currentRound} />
      </div>
      {game.round == 0 ? null : (
        <div className=' shrink flex flex-row rounded-xl p-4 bg-secondary w-full  justify-center justify-items-center'>
          <img
            className='rounded-l-xl object-scale-cover flex-1'
            src={`${process.env.NEXT_PUBLIC_API_URL}/images/${currentRound?.imageId}`}
          />
          <div className=' flex flex-1 rounded-r-xl'>
            <Map
              onMapClick={(e: ParsedCordinates) => (guessed ? null : setGuess(e))}
              guess={guess}
              guesses={
                answer?.guesses?.map((guess) => {
                  return {
                    score: guess.score,
                    player: game.members.find((member) => member.id == guess.memberId)!.player,
                    latLng: parseCordinates(guess.cordinates),
                  };
                }) ?? []
              }
              location={!answer ? null : parseCordinates(answer.image.cordinates)}
            />
          </div>
        </div>
      )}
      <div className='mt-2 space-x-8 items-center'>
        <Button
          onClick={handleNext}
          enable={
            isConnected &&
            (game.round == 0 ||
              game.members.every((member) => member.guesses.some((guess) => guess.roundId == currentRound?.id)))
          }
          className=''
        >
          Next
        </Button>
        <Button onClick={handleGuess} enable={guess != null && !guessed && isConnected} className=''>
          Guess
        </Button>
      </div>
    </main>
  );
}

function parseCordinates(val: string) {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}
