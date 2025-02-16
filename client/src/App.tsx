import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./App/Home.tsx";
import { RandomTweet } from "./App/RandomTweet.tsx";

export const DEV = true;
export const API = DEV ? "http://localhost:5000/" : "https://furryslop.com/";

export const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<RandomTweet />} />
				<Route path="/Tweets/:tweetid" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
