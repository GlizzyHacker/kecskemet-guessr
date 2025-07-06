import { ReactNode } from 'react';

export default function Radio(options: { value: string; group: string; children: ReactNode }) {
  return (
    <div>
      <input type='radio' id={options.value} name={options.group} value={options.value} />
      <label className='pl-2' htmlFor={options.value}>
        {options.children}
      </label>
    </div>
  );
}
