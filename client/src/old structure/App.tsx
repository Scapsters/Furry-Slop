import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TweetViewer from "./TweetViewer.tsx";
import RandomImage from "./RandomImage.tsx";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RandomImage/>}/>
                <Route path="/Tweets/:tweetid" element={<TweetViewer/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App