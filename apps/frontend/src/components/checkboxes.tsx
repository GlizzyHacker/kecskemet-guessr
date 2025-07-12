import { useState } from 'react';

export default function Checkboxes({
  options,
  selectionChanged,
}: {
  options: string[];
  selectionChanged: (selection: string[]) => void;
}) {
  const [selection, setSelection] = useState<string[]>([]);

  return options.map((option) => (
    <div id={option}>
      <input
        type='checkbox'
        id={option + 'input'}
        name={option}
        onClick={() => {
          const newSelection = selection.includes(option)
            ? selection.filter((e) => e != option)
            : selection.concat([option]);
          setSelection(newSelection);
          selectionChanged(newSelection);
        }}
      />
      <label className='pl-2' htmlFor={option + 'input'}>
        {option}
      </label>
    </div>
  ));
}
