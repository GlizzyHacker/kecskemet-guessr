'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { socket } from '../socket';

class Game {
  id: number = 0;
  active: boolean = true;
  round: number = 0;
}

class Round {
  id: number = 0;
  imageId: number = 0;
}

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play({ game }) {
  const [guess, setGuess] = useState(null);
  const [location, setLocation] = useState(null);
  const [round, setRound] = useState<Round | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    console.log('connecting');
    socket.auth = { game: game.id, name: 'test' };
    socket.connect();
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
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

  function onTurn(val: Round) {
    console.log(val);
    setRound(val);
  }
  function onGuess(val) {
    console.log(val);
    const rawLatLng = val.cordinates.split(',');
    const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
    setLocation(latLng);
  }

  function handleNext() {
    socket.emit('turn', { gameId: game.id });
    setLocation(null);
  }
  function handleGuess() {
    socket.emit('guess', {
      gameId: game.id,
      guess: { cordinates: `${guess?.lat ?? 0},${guess?.lng ?? 0}`, roundId: round?.id, playerId: 1 },
    });
  }

  return (
    <div>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Transport: {transport}</p>
      <button onClick={handleNext}>Next</button>
      {round == null ? null : (
        <>
          <img src={`http://localhost:3001/images/${round.imageId}`} />
          <Map onMapClick={(e: LatLng) => setGuess(e)} guess={guess} location={location} />
        </>
      )}
      <button onClick={handleGuess}>Guess</button>
    </div>
  );
}
