import api from '@/lib/api';
import { Area } from '@/types/area';
import useSWR from 'swr';

//Map cannot be converted to json
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetcher = (url: string) => api.get(`${url}`).then((res) => new Map<string, Area>(res.data));

export default function useApplications(): {
  data: Map<string, Area> | undefined;
  isLoading: boolean;
  mutate: () => void;
  error: unknown;
} {
  return useSWR<Map<string, Area>>(`/areas`, fetcher);
}
