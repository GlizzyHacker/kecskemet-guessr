'use client';

import useGame from '@/app/hooks/useGame';
import useGameConnection from '@/app/hooks/useGameConnection';
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

  return !gameState ? null : (
    <div>
      <p>Game id: {gameState.id}</p>
      <p>Round: {gameState.round}</p>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Players:</p>
      <ul>
        {gameState?.members?.map((member) => (
          <li key={member.id}>
            {member.player.name} {member.connected ? 'connected' : 'disconnected'} score:
            {member.guesses.reduce((sum, guess) => sum + guess.score, 0)}
            {member.guesses.some((guess) => guess.roundId == gameState.rounds[gameState.round - 1].id) ? 'guessed' : ''}
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>Next</button>
      {gameState.round == 0 ? null : (
        <>
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/images/${gameState.rounds[gameState.round - 1].imageId}`} />
          <Map
            onMapClick={(e: ParsedCordinates) => (locked ? null : setGuess(e))}
            guess={guess}
            guesses={
              answer?.guesses?.map((guess) => {
                return {
                  score: guess.score,
                  player: gameState.members.find((member) => member.id == guess.memberId)!.player,
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
