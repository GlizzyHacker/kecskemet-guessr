import { ReactNode } from 'react';

export default function Button({
  onClick,
  children,
  type = undefined,
  className = '',
  enable = true,
  icon = false,
}: {
  onClick?: () => void;
  children: ReactNode;
  type?: 'button' | 'reset' | 'submit' | undefined;
  className?: string;
  enable?: boolean;
  icon?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={!enable}
      className={`${className} disabled:opacity-10 enabled:cursor-pointer disabled:bg-on-surface active:opacity-50 not-hover:opacity-90 items-center rounded-xl text-on-primary ${icon ? 'p-1' : 'bg-primary p-2'}`}
    >
      <div className=''>{children}</div>
    </button>
  );
}
