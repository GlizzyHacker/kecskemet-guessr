import { Game } from '@/types/game';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(`${process.env.NEXT_PUBLIC_API_URL}${url}`).then((res) => res.data);

export default function useApplications(id: number) {
  return useSWR<Game>(`/games/${id}`, fetcher);
}
