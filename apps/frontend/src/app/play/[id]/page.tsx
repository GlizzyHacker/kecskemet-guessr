'use client';

import useGame from '@/app/hooks/useGame';
import useGameConnection from '@/app/hooks/useGameConnection';
import Scoreboard from '@/components/scoreboard';
import { ParsedCordinates } from '@/types/game';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play() {
  const [guess, setGuess] = useState<ParsedCordinates | null>(null);
  const [locked, setLocked] = useState(false);

  const searchParams = useSearchParams();
  const playerId = Number(searchParams.get('player'));
  const params = useParams();
  const { id } = params;
  const { data: initialGame, error: error } = useGame(Number(id));
  console.log(error);
  const { gameState, answer, isConnected, sendNext, sendGuess } = useGameConnection(initialGame, playerId);

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
    <p>Joining game</p>
  ) : (
    <div>
      <p>Game id: {game.id}</p>
      <p>Round: {game.round}</p>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <Scoreboard members={game.members} currentRound={game.rounds[game.round - 1]} />
      <button onClick={handleNext}>Next</button>
      {game.round == 0 ? null : (
        <>
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/images/${game.rounds[game.round - 1].imageId}`} />
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
        </>
      )}
      {guess == null || locked ? null : <button onClick={handleGuess}>Guess</button>}
    </div>
  );
}

function parseCordinates(val: string) {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}
