'use client';

import Play from '@/components/game';
import { Game, Player } from '@/types/game';
import { useState } from 'react';

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [game, setGame] = useState<Game | null>(null);

  async function handleCreatePlayer(formData: FormData) {
    try {
      const response = await fetch('https://3pcdhvbt-3001.euw.devtunnels.ms/players', {
        method: 'POST',
        body: JSON.stringify({ name: formData.get('name') }),
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
      const response = await fetch('https://3pcdhvbt-3001.euw.devtunnels.ms/games', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const json = await response.json();
      console.log(json);
      setGame(json);
    } catch (e) {
      console.log(e);
    }
  }
  async function handleJoinGame(formData: FormData) {
    try {
      const response = await fetch(`https://3pcdhvbt-3001.euw.devtunnels.ms/games/${formData.get('gameId')}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const json = await response.json();
      console.log(json);
      setGame(json);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <main className='flex items-center justify-center'>
      {player != null ? null : (
        <form action={handleCreatePlayer}>
          <input name='name' type='text' color='green' />
          <button type='submit'>Create player</button>
        </form>
      )}
      {game != null || player == null ? null : (
        <>
          <button onClick={handleCreateGame}>Create game</button>
          <form action={handleJoinGame}>
            <input name='gameId' type='number' />
            <button type='submit'>Join game</button>
          </form>
        </>
      )}
      {game == null || player == null ? null : <Play inital={game} playerId={player.id}></Play>}
    </main>
  );
}
