'use client';
import { Game, ParsedCordinates, RoundWithImage } from '@/types/game';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { socket } from '../socket';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play(options: { inital: Game; playerId: number }) {
  const [guess, setGuess] = useState<ParsedCordinates | null>(null);
  const [locked, setLocked] = useState(false);
  const [location, setLocation] = useState<ParsedCordinates | null>(null);
  const [game, setGame] = useState<Game>(options.inital);
  const [answer, setAnswer] = useState<RoundWithImage | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('connecting');
    socket.auth = { game: options.inital.id, playerId: options.playerId };
    socket.connect();
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('turn', onTurn);
    socket.on('guess', onGuess);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('turn', onTurn);
      socket.off('guess', onGuess);
    };
  }, []);

  function onTurn(val: Game) {
    console.log(val);
    setLocation(null);
    setGame(val);
    setAnswer(null);
    setLocked(false);
  }
  function onGuess(val: RoundWithImage) {
    console.log(val);
    setAnswer(val);
    setLocation(parseCordinates(val.image.cordinates));
  }

  function handleNext() {
    socket.emit('turn', { gameId: game.id });
  }
  function handleGuess() {
    socket.emit('guess', {
      gameId: game.id,
      guess: {
        cordinates: `${guess?.lat ?? 0},${guess?.lng ?? 0}`,
        roundId: game.rounds[game.round - 1].id,
        playerId: options.playerId,
      },
    });
    setLocked(true);
  }

  return (
    <div>
      <p>Game id: {game.id}</p>
      <p>Round: {game.round}</p>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Players:</p>
      <ul>
        {game?.members?.map((member) => (
          <li key={member.id}>
            {member.player.name} {member.connected ? 'connected' : 'disconnected'} score:
            {member.guesses.reduce((sum, guess) => sum + guess.score, 0)}
            {member.guesses.some((guess) => guess.roundId == game.rounds[game.round - 1].id) ? 'guessed' : ''}
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>Next</button>
      {game.round == 0 ? null : (
        <>
          <img src={`https://3pcdhvbt-3001.euw.devtunnels.ms/images/${game.rounds[game.round - 1].imageId}`} />
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
            location={location}
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
