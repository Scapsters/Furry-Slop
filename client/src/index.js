import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
	<BrowserRouter>
		<Routes>
			<Route index element={<App />}></Route>
			<Route path=":tweetId" element={<App />}></Route>
		</Routes>
	</BrowserRouter>
);
