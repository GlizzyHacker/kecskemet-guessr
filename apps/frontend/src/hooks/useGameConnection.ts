import { Game, Message, ParsedCordinates, Player, RoundWithAnswer } from '@/types/game';
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
  messages: Message[];
  sendNext: () => void;
  sendGuess: (cords: ParsedCordinates) => void;
  sendMessage: (content: string) => void;
} {
  const [gameState, setGameState] = useState<Game | undefined>(game);
  const [answer, setAnswer] = useState<RoundWithAnswer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const socketRef = useRef(
    io(process.env.NEXT_PUBLIC_API_URL, {
      autoConnect: false,
      extraHeaders: {
        authorization: `Bearer ${Cookies.get('jwt')}`,
      },
    })
  );

  //Neccessary to avoid reconnecting for every new message
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  });

  useEffect(() => {
    const socket = socketRef.current;
    if (!game || !player) {
      return;
    }
    console.log('connecting');
    socket.auth = { game: game.id };
    socket.connect();
    if (socket.connected) {
      onConnect();
    }

    function onConnect(): void {
      setIsConnected(true);
    }

    function onDisconnect(): void {
      setIsConnected(false);
    }

    function onTurn(val: Game): void {
      if (val.round != (gameState ?? game!).round) {
        setAnswer(null);
      }
      setGameState(val);
    }

    function onGuess(val: RoundWithAnswer): void {
      setAnswer(val);
    }

    function onChat(val: Message): void {
      console.log(`New message:`);
      console.log(val);
      console.log('old messages:');
      console.log(messagesRef.current);
      setMessages([...messagesRef.current, val]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('turn', onTurn);
    socket.on('guess', onGuess);
    socket.on('chat', onChat);

    return (): void => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('turn', onTurn);
      socket.off('guess', onGuess);
      socket.off('chat', onChat);
    };
  }, [player, game]);

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

  function sendMessage(content: string): void {
    socketRef.current.emit('chat', { message: { gameId: (gameState ?? game)?.id, content: content } });
  }

  return {
    gameState,
    answer,
    isConnected,
    messages,
    sendNext,
    sendGuess,
    sendMessage,
  };
}
