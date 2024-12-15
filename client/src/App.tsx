import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TweetViewer from "./TweetViewer.tsx";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TweetViewer/>}/>
                <Route path="/Tweets/:tweetid" element={<TweetViewer/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App