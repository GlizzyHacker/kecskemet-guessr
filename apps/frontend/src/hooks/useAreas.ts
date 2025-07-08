import api from '@/lib/api';
import { Area } from '@/types/area';
import useSWR from 'swr';

//Map cannot be converted to json
const fetcher = (url: string) => api.get(`${url}`).then((res) => new Map<string, Area>(res.data));

export default function useApplications() {
  return useSWR<Map<string, Area>>(`/areas`, fetcher);
}
