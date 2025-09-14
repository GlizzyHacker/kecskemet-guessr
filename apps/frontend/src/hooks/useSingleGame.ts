import api from '@/lib/api';
import { Game, ParsedCordinates, Player, Round, RoundWithAnswer } from '@/types/game';
import { Image, ImageWithAnswer } from '@/types/image';
import { useEffect, useState } from 'react';

export default function useSingleGame({
  player,
  initialGame,
}: {
  player: Player | undefined;
  initialGame: Game | undefined;
}): {
  game: Game | null;
  answer: RoundWithAnswer | null;
  sendNext: () => void;
  sendGuess: (cords: ParsedCordinates) => void;
} {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [answer, setAnswer] = useState<RoundWithAnswer | null>(null);
  useEffect(() => {
    setRounds([]);
    setAnswer(null);
  }, [initialGame]);
  async function sendNext(): Promise<void> {
    const response = await api.post('images', {
      areas: initialGame!.area.split(','),
      difficulty: initialGame!.difficulty,
      playerId: player?.id,
    });
    const imageArea: Image = response.data;
    const imageLocation: ImageWithAnswer = response.data;
    if (!initialGame?.hint) {
      imageArea.area = undefined;
    }
    setRounds([...rounds, { id: 0, image: imageArea, createdAt: '', guesses: [] }]);
    setAnswer({ id: 0, image: imageLocation, guesses: [] });
  }

  function sendGuess(cords: ParsedCordinates): void {
    const round = rounds.at(-1)!;
    round?.guesses.push({ id: 0, memberId: 0, cordinates: `${cords.lat},${cords.lng}`, score: 0, roundId: 0 });
    setRounds([...rounds.slice(0, -1), round]);
  }

  const game: Game | null =
    !player || !initialGame
      ? null
      : {
          id: 0,
          timer: initialGame.timer,
          totalRounds: initialGame.totalRounds,
          members: [
            {
              id: 0,
              player: player,
              isOwner: true,
              guesses: [],
              connected: true,
            },
          ],
          area: initialGame.area,
          difficulty: initialGame.difficulty,
          round: rounds.length,
          rounds: rounds,
          active: initialGame.totalRounds >= rounds.length,
        };
  return { game, answer: (rounds.at(-1)?.guesses.length ?? 0 > 0) ? answer : null, sendNext, sendGuess };
}
