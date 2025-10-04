import { ReactNode } from 'react';

export default function ErrorCard({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`${className} rounded-xl p-2 bg-red-600`}>
      <div className='h-full w-full rounded-[4] p-4 bg-red-600 text-white'>{children}</div>
    </div>
  );
}
