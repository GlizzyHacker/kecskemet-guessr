import useSWR from 'swr';

import api from '@/lib/api';
import { ImageWithMetadata } from '@/types/image';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetcher = (url: string) => api.get(`${url}`).then((res) => res.data);

export default function useImages(
  count: number,
  offset: number
): {
  data: ImageWithMetadata[] | undefined;
  isLoading: boolean;
  mutate: () => void;
  error: unknown;
} {
  return useSWR<ImageWithMetadata[]>(`/images/?count=${count}&offset=${offset}`, fetcher, {
    shouldRetryOnError: false,
  });
}
