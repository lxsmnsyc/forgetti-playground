import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(c => c + 1);
  };

  return (
    <button type="button" onClick={increment}>
      Count: {count}
    </button>
  );
}
