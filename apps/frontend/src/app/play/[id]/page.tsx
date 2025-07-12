'use client';

import Button from '@/components/button';
import Card from '@/components/card';
import GameInfo from '@/components/game_info';
import LoadingIndicator from '@/components/loading_indicator';
import Scoreboard from '@/components/scoreboard';
import useGame from '@/hooks/useGame';
import useGameConnection from '@/hooks/useGameConnection';
import usePlayer from '@/hooks/usePlayer';
import { ParsedCordinates } from '@/types/game';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play() {
  const [guess, setGuess] = useState<ParsedCordinates | undefined>(undefined);
  const { data: player } = usePlayer();
  const { id } = useParams();
  const { data: initialGame, error: error } = useGame(Number(id));
  const { gameState, answer, isConnected, sendNext, sendGuess } = useGameConnection(initialGame, player);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [gameState]);

  function handleGuess() {
    if (guess) {
      sendGuess(guess);
    }
  }

  function handleNext() {
    setLoading(true);
    sendNext();
  }

  const game = gameState ?? initialGame;
  const currentRound = game?.rounds[game.round - 1] ?? null;
  const guessed = game?.members
    .find((member) => member.player.id == player?.id)
    ?.guesses.some((guess) => guess.roundId == currentRound?.id);

  if (game?.active === false) {
    return (
      <div className='flex flex-col items-center space-y-2'>
        <Card className=''>Game is over</Card>
        <Scoreboard members={game.members} currentRound={currentRound} />
      </div>
    );
  }

  return !game ? (
    <div className='flex flex-col items-center space-y-2'>
      <Card>
        <p>Joining game</p>
      </Card>
    </div>
  ) : (
    <main className='flex flex-col items-center justify-center w-full space-y-2'>
      <div className='flex  items-stretch w-full space-x-3'>
        <GameInfo className='flex-1  min-w-0' game={game} />
        <Scoreboard className='flex-1  min-w-0' members={game.members} currentRound={currentRound} />
      </div>
      {game.round == 0 ? null : (
        <div className='shrink rounded-xl p-2 bg-secondary w-full relative'>
          <div className={`${loading ? 'blur-xl' : ''} flex flex-row justify-center justify-items-center`}>
            <img
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
      <div className='space-x-8 items-center'>
        <Button
          onClick={handleNext}
          enable={
            isConnected &&
            (game.round == 0 ||
              game.members.every((member) => member.guesses.some((guess) => guess.roundId == currentRound?.id)))
          }
          className=''
        >
          Next
        </Button>
        <Button onClick={handleGuess} enable={guess != undefined && !guessed && isConnected} className=''>
          Guess
        </Button>
      </div>
    </main>
  );
}

function parseCordinates(val: string) {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}
