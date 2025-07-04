'use client';

import Button from '@/components/button';
import GameInfo from '@/components/game_info';
import Scoreboard from '@/components/scoreboard';
import useGame from '@/hooks/useGame';
import useGameConnection from '@/hooks/useGameConnection';
import usePlayer from '@/hooks/usePlayer';
import { ParsedCordinates } from '@/types/game';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play() {
  const [guess, setGuess] = useState<ParsedCordinates | null>(null);
  const [locked, setLocked] = useState(false);
  const { data: player } = usePlayer();
  const params = useParams();
  const { id } = params;
  const { data: initialGame, error: error } = useGame(Number(id));
  const { gameState, answer, isConnected, sendNext, sendGuess } = useGameConnection(initialGame, player);

  useEffect(() => {
    if (!answer) {
      setLocked(false);
    }
  }, [gameState]);

  function handleGuess() {
    if (guess) {
      setLocked(true);
      sendGuess(guess);
    }
  }

  function handleNext() {
    sendNext();
  }

  const game = gameState ?? initialGame;

  return !game ? (
    <p>Joining game</p>
  ) : (
    <main className='flex flex-col items-center justify-center w-full'>
      <div className='flex w-full pb-4 space-x-2'>
        <GameInfo className='flex-1 h-full' game={game} />
        <Scoreboard className='flex-1 h-full' members={game.members} currentRound={game.rounds[game.round - 1]} />
      </div>
      {game.round == 0 ? null : (
        <div className=' shrink flex flex-row rounded-xl p-4 bg-secondary w-full  justify-center justify-items-center'>
          <img
            className='rounded-l-xl object-scale-cover flex-1'
            src={`${process.env.NEXT_PUBLIC_API_URL}/images/${game.rounds[game.round - 1].imageId}`}
          />
          <div className=' flex flex-1 rounded-r-xl'>
            <Map
              onMapClick={(e: ParsedCordinates) => (locked ? null : setGuess(e))}
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
          enable={isConnected && (game.round == 0 || answer != null || location == null)}
          className=''
        >
          Next
        </Button>
        <Button onClick={handleGuess} enable={guess != null && !locked && isConnected} className=''>
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
