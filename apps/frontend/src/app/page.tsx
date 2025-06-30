'use client';

import CreatePlayer from '@/components/create_player';
import SelectGame from '@/components/select_game';
import { Game, Player } from '@/types/game';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);

  async function handleCreatePlayer(name: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`, {
        method: 'POST',
        body: JSON.stringify({ name: name }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const json = await response.json();
      console.log(json);
      setPlayer(json);
    } catch (e) {
      console.log(e);
    }
  }
  async function handleCreateGame() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const json = await response.json();
      console.log(json);
      joinGame(json);
    } catch (e) {
      console.log(e);
    }
  }
  async function handleJoinGame(gameId: number) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const json = await response.json();
      console.log(json);
      joinGame(json);
    } catch (e) {
      console.log(e);
    }
  }

  function joinGame(game: Game) {
    router.push(`/play/${game.id}?player=${player!.id}`);
  }

  return (
    <main className='flex items-center justify-center'>
      {player != null ? null : <CreatePlayer onCreatePlayer={handleCreatePlayer} />}
      {player == null ? null : <SelectGame onCreate={handleCreateGame} onJoin={handleJoinGame} />}
    </main>
  );
}
