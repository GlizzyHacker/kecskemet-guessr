import api from '@/lib/api';
import { Guess } from '@/types/game';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import ErrorCard from './error_card';

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
      <div>
        <input
          className='sr-only peer'
          type='radio'
          id='vote+'
          onClick={() => onVote(1)}
          name='vote'
          value='1'
          defaultChecked={vote == 1}
        />
        <label className='opacity-50 peer-checked:opacity-100 cursor-pointer' htmlFor='vote+'>
          <FaRegThumbsUp />
        </label>
      </div>
      <div>
        <input
          className='sr-only peer'
          type='radio'
          id='vote-'
          onClick={() => onVote(-1)}
          name='vote'
          value='-1'
          defaultChecked={vote == -1}
        />
        <label className='opacity-50 peer-checked:opacity-100 cursor-pointer' htmlFor='vote-'>
          <FaRegThumbsDown />
        </label>
      </div>
      {error && <ErrorCard className='m-2'>{error}</ErrorCard>}
    </div>
  );
}
