import { ReactNode } from 'react';

export default function Card({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={`${className} rounded-xl p-2 bg-surface-container-low text-on-secondary-container`}>{children}</div>;
}
