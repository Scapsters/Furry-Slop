import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import Redirect from "./Redirect.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
	<BrowserRouter>
		<Routes>
			<Route index element={<Redirect />}></Route>
			<Route path="/tweets/" element={<App entry={true}/>}></Route>
			<Route path="/slop/" element={<App entry={true}/>}></Route>
			<Route path="/tweets/:tweetId?" element={<App entry={false}/>}></Route>
			<Route path="/slop/:tweetId?" element={<App entry={false}/>}></Route>
		</Routes>
	</BrowserRouter>
);
