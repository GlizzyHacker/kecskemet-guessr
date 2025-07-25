import useSWR from 'swr';

import api from '@/lib/api';
import { Player } from '@/types/game';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetcher = (url: string) => api.get(`${url}`).then((res) => res.data);

export default function usePlayer(): {
  data: Player | undefined;
  isLoading: boolean;
  mutate: () => void;
  error: unknown;
} {
  return useSWR<Player>('/players/me', fetcher, {
    shouldRetryOnError: false,
  });
}
