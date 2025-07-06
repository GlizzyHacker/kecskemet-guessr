import { ReactNode } from 'react';

export default function Radio(options: { value: string; group: string; children: ReactNode; isDefault?: boolean }) {
  return (
    <div>
      <input
        type='radio'
        id={options.group + options.value}
        name={options.group}
        value={options.value}
        defaultChecked={options.isDefault}
      />
      <label className='pl-2' htmlFor={options.group + options.value}>
        {options.children}
      </label>
    </div>
  );
}
