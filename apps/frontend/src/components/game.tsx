'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { socket } from '../socket';

class Game {
  id: number = 0;
  active: boolean = true;
  round: number = 0;
  members: Array<any> = [];
  rounds: Array<any> = [];
}

class Round {
  id: number = 0;
  imageId: number = 0;
  guesses: Array<any> = [];
}

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play({ inital, playerId }) {
  const [guess, setGuess] = useState(null);
  const [locked, setLocked] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [game, setGame] = useState<Game>(inital);
  const [answer, setAnswer] = useState<Round | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('connecting');
    socket.auth = { game: inital.id, playerId: playerId };
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
  function onGuess(val) {
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
        playerId: playerId,
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
        {game?.members?.map((e) => (
          <li key={e.id}>
            {e.player.name} {e.connected ? 'connected' : 'disconnected'} score:
            {e.guesses.reduce((sum, e) => sum + e.score, 0)}
            {e.guesses.some((guess) => guess.roundId == game.rounds[game.round - 1].id) ? 'guessed' : ''}
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>Next</button>
      {game.round == 0 ? null : (
        <>
          <img src={`https://3pcdhvbt-3001.euw.devtunnels.ms/images/${game.rounds[game.round - 1].imageId}`} />
          <Map
            onMapClick={(e: LatLng) => (locked ? null : setGuess(e))}
            guess={guess}
            guesses={answer?.guesses?.map((e) => {
              return {
                score: e.score,
                player: game.members.find((p) => p.id == e.memberId).player,
                latLng: parseCordinates(e.cordinates),
              };
            })}
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
