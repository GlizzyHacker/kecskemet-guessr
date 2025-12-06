'use client';

import ActionBar from '@/components/action_bar';
import Card from '@/components/card';
import CreateGame from '@/components/create_game';
import GuessCountdown from '@/components/guess_countdown';
import ImageVote from '@/components/image_vote';
import LoadingIndicator from '@/components/loading_indicator';
import SingleGameInfo from '@/components/single_game_info';
import usePlayer from '@/hooks/usePlayer';
import useSingleGame from '@/hooks/useSingleGame';
import { parseCordinates } from '@/lib/cordinates';
import { Game, GamePhase, ParsedCordinates } from '@/types/game';
import { Difficulty } from '@/types/image';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('@/components/map'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Play() {
  const [guess, setGuess] = useState<ParsedCordinates | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [initialGame, setInitialGame] = useState<Game>();
  const t = useTranslations('Play');

  const { data: player } = usePlayer();
  const {
    game: gameState,
    answer,
    sendNext,
    sendGuess,
  } = useSingleGame({
    player: player,
    initialGame,
  });

  useEffect(() => {
    if (loading) {
      setGuess(undefined);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  function handleAction(phase: GamePhase) {
    if (!initialGame) {
      return;
    }
    if (phase == GamePhase.GUESSING && guess) {
      sendGuess(guess);
    } else if (phase == GamePhase.REVEAL || phase == GamePhase.START) {
      setLoading(true);
      sendNext();
    } else if (phase == GamePhase.END) {
      setInitialGame(undefined);
    }
  }

  async function handleForm(formData: FormData) {
    const request = {
      difficulty: String(formData.get('difficulty')) as Difficulty,
      area: String(formData.get('areas')),
      timer: Number(formData.get('timer')),
      totalRounds: Number(formData.get('rounds')),
      hint: Boolean(formData.get('hint')),
      id: 0,
      active: true,
      round: 0,
      members: [],
      rounds: [],
      memberLimit: 1,
      joinCode: '',
    };
    setInitialGame(request);
  }

  if (!initialGame) {
    return <CreateGame onForm={handleForm} />;
  }
  const game = gameState ?? initialGame;

  const currentRound = game.rounds[game.round - 1] ?? null;
  const guessed = currentRound?.guesses.length ?? 0 > 0;

  const phase = game.active
    ? game.round == 0
      ? GamePhase.START
      : answer
        ? GamePhase.REVEAL
        : GamePhase.GUESSING
    : GamePhase.END;

  return (
    <main className='flex flex-col items-stretch w-full space-y-2'>
      <SingleGameInfo game={game} />
      {game.round == 0 || !game.active ? null : (
        <Card className='flex-1 w-full relative'>
          <div
            className={`${loading ? 'blur-xl' : ''} rounded-[10] overflow-hidden flex max-md:flex-col justify-center justify-items-center`}
          >
            <div className='flex-1'>
              <Image
                className='w-full h-auto'
                alt={t('image_placeholder')}
                width={1000}
                height={1000}
                src={`${process.env.NEXT_PUBLIC_API_URL}/images/${currentRound?.image.id}`}
              />
            </div>
            <div className='flex flex-1 items-center'>
              <Map
                onMapClick={(e: ParsedCordinates) => (guessed ? null : setGuess(e))}
                areas={game.area.split(',')}
                hint={currentRound?.image.area}
                guess={guess}
                guesses={
                  currentRound?.guesses?.map((guess) => {
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
        </Card>
      )}
      <ActionBar phase={phase} onAction={handleAction}>
        {phase == GamePhase.REVEAL ? (
          <ImageVote
            guess={answer?.guesses.find(
              (guess) => game.members.find((member) => member.player.id == player?.id)?.id == guess.memberId
            )}
          />
        ) : game.timer == 0 ? null : (
          <GuessCountdown game={game} />
        )}
      </ActionBar>
    </main>
  );
}
