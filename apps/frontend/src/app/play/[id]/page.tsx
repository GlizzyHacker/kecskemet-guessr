'use client';

import Button from '@/components/button';
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
  }, [answer]);

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
    <div className='flex flex-col items-center justify-center'>
      <p>Joining game</p>
    </div>
  ) : (
    <main className='flex flex-col items-center justify-center'>
      <div className='flex flex-row'>
        <p className='p-2'>Game id: {game.id}</p>
        <p className='p-2'>Round: {game.round}</p>
        <p className='p-2'>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      </div>
      <Scoreboard members={game.members} currentRound={game.rounds[game.round - 1]} />
      {game.round == 0 ? null : (
        <div className='flex h-min rounded-xl p-4 bg-secondary'>
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/images/${game.rounds[game.round - 1].imageId}`}
            className='object-contain rounded-l-xl grow-1'
          />
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
      )}
      <div className='flex'>
        <Button onClick={handleNext} enable={isConnected && (game.round == 0 || answer != null)} className='m-2'>
          Next
        </Button>
        <Button onClick={handleGuess} enable={guess != null && !locked && isConnected} className='m-2'>
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
