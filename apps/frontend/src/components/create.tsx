'use client';

import { useState } from 'react';
import Play from './game';

export default function Create() {
  const [value, setValue] = useState(null);
  async function handleClick() {
    try {
      const response = await fetch('http://localhost:3001/games', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const json = await response.json();
      console.log(json);
      setValue(json);
    } catch (e) {
      console.log(e);
    }
  }

  return value == null ? <button onClick={handleClick}>Create game</button> : <Play game={value} />;
}
