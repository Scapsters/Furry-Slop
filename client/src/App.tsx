import React from 'react';
import useAsync from './UseAsync.tsx';
import type ImageData from '../../interfaces/ImageData.ts';
import ImageBundle from './Image.tsx';

const awaitImageData = async (): Promise<ImageData[]> => {
  const response = await fetch("http://localhost:5000/RandomImageData")
  if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return await response.json()
}

const App = () => {

  const [imageDataArray, isLoading] = useAsync(awaitImageData, [])

  if(isLoading || imageDataArray === undefined ) return <p> Loading... </p>
  if(imageDataArray.length === 0) return <p> No data </p>
  console.log(imageDataArray)
  console.log('hi')

  return <div>
    <ImageBundle imageDataArray={imageDataArray}></ImageBundle>
  </div>
}

export default App;
