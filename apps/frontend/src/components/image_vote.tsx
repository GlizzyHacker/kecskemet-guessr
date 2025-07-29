import api from '@/lib/api';
import { Guess } from '@/types/game';
import { AxiosError } from 'axios';
import { useState } from 'react';
import ErrorCard from './error_card';
import Radio from './radio';

export default function ImageVote({ guess }: { guess: Guess | undefined }) {
  const [vote, setVote] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function onVote(vote: number) {
    setVote(vote);
    try {
      await api.patch(`${process.env.NEXT_PUBLIC_API_URL}/guesses/${guess!.id}`, { vote: vote });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.data?.message instanceof Array) {
          setError(e.response.data.message.join(', '));
        } else {
          setError(e.message);
        }
      }
      console.log(e);
    }
  }
  if (!guess) {
    return;
  }

  return (
    <div className='flex flex-row space-x-2'>
      <Radio group='vote' value='1' onSelect={() => onVote(1)} isDefault={vote == 1}>
        Like
      </Radio>
      <Radio group='vote' value='-1' onSelect={() => onVote(-1)} isDefault={vote == -1}>
        Dislike
      </Radio>
      {error && <ErrorCard className='m-2'>{error}</ErrorCard>}
    </div>
  );
}
