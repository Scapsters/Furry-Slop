import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Home.tsx";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/Tweets/:tweetid" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App