import api from '@/lib/api';
import { Game } from '@/types/game';
import useSWR from 'swr';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetcher = (url: string) => api.get(`${url}`).then((res) => res.data);

export default function useApplications(id: number): {
  data: Game | undefined;
  isLoading: boolean;
  mutate: () => void;
  error: unknown;
} {
  return useSWR<Game>(`/games/${id}`, fetcher);
}
