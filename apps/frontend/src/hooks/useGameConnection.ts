import { Game, ParsedCordinates, Player, RoundWithAnswer } from '@/types/game';
import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function useGameConnection(
  game: Game | undefined,
  player: Player | undefined
): {
  gameState: Game | undefined;
  answer: RoundWithAnswer | null;
  isConnected: boolean;
  sendNext: () => void;
  sendGuess: (cords: ParsedCordinates) => void;
} {
  const [gameState, setGameState] = useState<Game | undefined>(game);
  const [answer, setAnswer] = useState<RoundWithAnswer | null>(null);
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
    console.log('connecting');
    socketRef.current.auth = { game: game.id };
    socketRef.current.connect();
    if (socketRef.current.connected) {
      onConnect();
    }

    function onConnect(): void {
      setIsConnected(true);
    }

    function onDisconnect(): void {
      setIsConnected(false);
    }

    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);
    socketRef.current.on('turn', onTurn);
    socketRef.current.on('guess', onGuess);

    return (): void => {
      socketRef.current.off('connect', onConnect);
      socketRef.current.off('disconnect', onDisconnect);
      socketRef.current.off('turn', onTurn);
      socketRef.current.off('guess', onGuess);
    };
  }, [player, game]);

  function onTurn(val: Game): void {
    if (val.round != (gameState ?? game!).round) {
      setAnswer(null);
    }
    setGameState(val);
  }

  function onGuess(val: RoundWithAnswer): void {
    setAnswer(val);
  }

  function sendNext(): void {
    socketRef.current.emit('turn', { gameId: (gameState ?? game)!.id });
  }

  function sendGuess(cords: ParsedCordinates): void {
    socketRef.current.emit('guess', {
      gameId: (gameState ?? game)!.id,
      guess: {
        cordinates: `${cords.lat ?? 0},${cords.lng ?? 0}`,
        roundId: (gameState ?? game)!.rounds[(gameState ?? game)!.round - 1].id,
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
