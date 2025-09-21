import api from '@/lib/api';
import { Game } from '@/types/game';
import { AxiosError } from 'axios';
import useSWR from 'swr';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetcher = (url: string) =>
  api.get(`${url}`).then((res) => {
    return res.data;
  });

export default function useGame(joinCode: string): {
  data: Game | undefined;
  isLoading: boolean;
  mutate: () => void;
  error: AxiosError;
} {
  return useSWR<Game>(`/games/${joinCode}`, fetcher);
}
