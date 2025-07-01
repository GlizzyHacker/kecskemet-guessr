import { socket } from '@/socket';
import { Game, ParsedCordinates, Player, RoundWithImage } from '@/types/game';
import { useEffect, useState } from 'react';

export default function useGameConnection(game: Game | undefined, player: Player | undefined) {
  const [gameState, setGameState] = useState<Game | undefined>(game);
  const [answer, setAnswer] = useState<RoundWithImage | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!game || !player) {
      return;
    }
    console.log(game);
    console.log('connecting');
    socket.auth = { game: game.id, playerId: player.id };
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
    socket.emit('turn', { gameId: gameState!.id });
  }

  function sendGuess(cords: ParsedCordinates) {
    socket.emit('guess', {
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
