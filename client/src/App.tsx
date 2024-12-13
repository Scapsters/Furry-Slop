import React from 'react';
import useAsync from './UseAsync.tsx';

function App() {
  const [imageURL, isLoading] = useAsync(fetch("localhost:5000/RandomImageURL"), "", )
  return <>
    <p> uwu </p>
  </>
}

export default App;
