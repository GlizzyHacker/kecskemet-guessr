'use client';

import Button from '@/components/button';
import Card from '@/components/card';
import ErrorCard from '@/components/error_card';
import useImages from '@/hooks/useImages';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useState } from 'react';

export default function Admin() {
  const { data: images, mutate: mutate } = useImages(50, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete(id: number) {
    setLoading(true);
    try {
      const response = await api.delete(`/images/${id}`);
      if (response.status == 200) {
        setError(null);
        mutate();
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.data?.message.join !== undefined) {
          setError(e.response.data.message.join(', '));
        } else {
          setError(e.message);
        }
      }
      setLoading(false);
    }
    setLoading(false);
  }
  return (
    <main className='flex flex-col'>
      {error && <ErrorCard>{error}</ErrorCard>}
      <Card>
        {images?.map((image) => (
          <div key={image.id} className='h-40 flex flex-row items-center space-x-2'>
            <Image
              className='object-scale-down'
              height={160}
              width={160}
              alt='image here'
              src={`${process.env.NEXT_PUBLIC_API_URL}/images/${image.id}`}
            />
            <p>{image.id}</p>
            <p>{image.area}</p>
            <p>{image.cordinates}</p>
            <p>{image.difficulty}</p>
            <p>{image.score}</p>
            <div className='flex flex-col flex-1 items-end'>
              <Button enable={!loading} onClick={() => onDelete(image.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </main>
  );
}
