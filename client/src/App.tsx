import React from 'react';
import useAsync from './UseAsync.tsx';
import type ImageData from '../../interfaces/ImageData.ts';

const awaitImageData = async (): Promise<ImageData[]> => {
  const response = await fetch("http://localhost:5000/RandomImageData")
  if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return await response.json()
}

const App = () => {

  const [imageData, isLoading] = useAsync(awaitImageData, [])

  if(isLoading || imageData === undefined ) return <p> Loading... </p>
  if(imageData.length === 0) return <p> No data </p>
  console.log(imageData)
  console.log('hi')

  return <div>
    <h1>Fetched Image:</h1>
    <img src={`http://localhost:5000/Images/${imageData[0].tweetid}`} alt="Random fetched" />
    <p>URL: {`http://localhost:5000/Images/${imageData[0].tweetid}`}</p>
  </div>
}

export default App;
