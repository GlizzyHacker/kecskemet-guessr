import { ReactNode } from 'react';

export default function Card({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`${className} rounded-xl p-2 bg-secondary`}>
      <div className='h-full w-full rounded-xl p-4 bg-primary'>{children}</div>
    </div>
  );
}
