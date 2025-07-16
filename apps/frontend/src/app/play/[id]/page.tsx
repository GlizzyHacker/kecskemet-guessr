'use client';

import ActionBar from '@/components/action_bar';
import Card from '@/components/card';
import GameInfo from '@/components/game_info';
import LoadingIndicator from '@/components/loading_indicator';
import Scoreboard from '@/components/scoreboard';
import useGame from '@/hooks/useGame';
import useGameConnection from '@/hooks/useGameConnection';
import usePlayer from '@/hooks/usePlayer';
import { GamePhase, ParsedCordinates } from '@/types/game';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play() {
  const { data: player } = usePlayer();
  const { id } = useParams();
  const { data: initialGame } = useGame(Number(id));
  const { gameState, answer, isConnected, sendNext, sendGuess } = useGameConnection(initialGame, player);

  const router = useRouter();
  const [guess, setGuess] = useState<ParsedCordinates | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [gameState]);

  function handleAction(phase: GamePhase) {
    if (phase == GamePhase.GUESSING && guess) {
      sendGuess(guess);
    } else if (phase == GamePhase.REVEAL || phase == GamePhase.START) {
      setLoading(true);
      sendNext();
    } else if (phase == GamePhase.END) {
      router.push('/play');
    }
  }

  const game = gameState ?? initialGame;

  if (!game) {
    return (
      <div className='flex flex-col items-center space-y-2'>
        <Card>
          <p>Loading game</p>
        </Card>
      </div>
    );
  }

  const currentRound = game.rounds[game.round - 1] ?? null;
  const guessed = game.members
    .find((member) => member.player.id == player?.id)
    ?.guesses.some((guess) => guess.roundId == currentRound?.id);

  const phase = game.active
    ? isConnected
      ? game.round == 0
        ? GamePhase.START
        : answer
          ? GamePhase.REVEAL
          : guessed
            ? GamePhase.GUESSED
            : GamePhase.GUESSING
      : GamePhase.DISCONNECTED
    : GamePhase.END;

  return (
    <main className='flex flex-col items-center justify-center w-full space-y-2'>
      <div className='flex  items-stretch w-full space-x-3'>
        <GameInfo className='flex-1  min-w-0' game={game} />
        <Scoreboard className='flex-1  min-w-0' members={game.members} currentRound={currentRound} />
      </div>
      {game.round == 0 || !game.active ? null : (
        <div className='shrink rounded-xl p-2 bg-secondary w-full relative'>
          <div className={`${loading ? 'blur-xl' : ''} flex flex-row justify-center justify-items-center`}>
            <Image
              alt='Image to guess'
              className='rounded-l-xl object-scale-cover flex-1'
              src={`${process.env.NEXT_PUBLIC_API_URL}/images/${currentRound?.image.id}`}
            />
            <div className='flex flex-1 rounded-r-xl items-center'>
              <Map
                onMapClick={(e: ParsedCordinates) => (guessed ? null : setGuess(e))}
                areas={game.area.split(',')}
                hint={currentRound?.image.area}
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
                location={!answer ? undefined : parseCordinates(answer.image.cordinates)}
              />
            </div>
          </div>
          {loading && (
            <div className='absolute top-1/3 bottom-1/3 left-1/3 right-1/3'>
              <LoadingIndicator />
            </div>
          )}
        </div>
      )}
      <ActionBar phase={phase} onAction={handleAction} />
    </main>
  );
}

function parseCordinates(val: string) {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}
