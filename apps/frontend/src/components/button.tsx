import { ReactNode } from 'react';

export default function Button({
  onClick,
  children,
  type = undefined,
  className = '',
  enable = true,
}: {
  onClick?: () => void;
  children: ReactNode;
  type?: 'button' | 'reset' | 'submit' | undefined;
  className?: string;
  enable?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={!enable}
      className={`${className} disabled:opacity-15 enabled:cursor-pointer disabled:bg-black bg-tertiary items-center rounded-xl p-1`}
    >
      <div className='bg-primary items-center rounded-xl p-2'>{children}</div>
    </button>
  );
}
