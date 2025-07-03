import { Game, ParsedCordinates, Player, RoundWithImage } from '@/types/game';
import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function useGameConnection(game: Game | undefined, player: Player | undefined) {
  const [gameState, setGameState] = useState<Game | undefined>(game);
  const [answer, setAnswer] = useState<RoundWithImage | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(
    io(process.env.NEXT_PUBLIC_API_URL, {
      autoConnect: false,
      extraHeaders: {
        authorization: `Bearer ${Cookies.get('jwt')}`,
      },
    })
  );

  useEffect(() => {
    if (!game || !player) {
      return;
    }
    console.log(game);
    console.log('connecting');
    socketRef.current.auth = { game: game.id};
    socketRef.current.connect();
    if (socketRef.current.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);
    socketRef.current.on('turn', onTurn);
    socketRef.current.on('guess', onGuess);

    return () => {
      socketRef.current.off('connect', onConnect);
      socketRef.current.off('disconnect', onDisconnect);
      socketRef.current.off('turn', onTurn);
      socketRef.current.off('guess', onGuess);
    };
  }, [player, game]);

  function onTurn(val: Game) {
    console.log(val);
    if (val.round != (gameState ?? game!).round) {
      setAnswer(null);
    }
    setGameState(val);
  }

  function onGuess(val: RoundWithImage) {
    console.log(val);
    setAnswer(val);
  }

  function sendNext() {
    socketRef.current.emit('turn', { gameId: gameState!.id });
  }

  function sendGuess(cords: ParsedCordinates) {
    socketRef.current.emit('guess', {
      gameId: gameState!.id,
      guess: {
        cordinates: `${cords.lat ?? 0},${cords.lng ?? 0}`,
        roundId: gameState!.rounds[gameState!.round - 1].id,
        playerId: player!.id,
      },
    });
  }

  return {
    gameState,
    answer,
    isConnected,
    sendNext,
    sendGuess,
  };
}
