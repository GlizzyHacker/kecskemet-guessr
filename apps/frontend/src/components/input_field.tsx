import { HTMLInputTypeAttribute, ReactNode } from 'react';

export default function InputField({
  type,
  name,
  defaultValue,
  children,
  placeholder,
}: {
  type: HTMLInputTypeAttribute;
  name: string;
  defaultValue?: string | number;
  children?: ReactNode;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name}>{children}</label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className='bg-primary text-on-primary not-hover:opacity-90 focus:opacity-100 flex rounded-xl p-2'
      />
    </div>
  );
}
