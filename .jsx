import React, { useState } from 'react';

export default function WorkingInput() {
  const [text, setText] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc' }}
        value={text}
        onChange={(e) => setText(e.target.value)} // Updates state without unmounting the input
        placeholder="Type here..."
      />
    </div>
  );
}
