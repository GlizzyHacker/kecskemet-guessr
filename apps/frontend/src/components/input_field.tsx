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
    <>
      <label htmlFor={name}>{children}</label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className='bg-primary flex rounded-xl p-2'
      />
    </>
  );
}
