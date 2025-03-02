import React, { useEffect } from "react";
import "./Refresh.css";

export const Refresh = ({ next }) => {
	useEffect(() => {
		const handleSpacebar = (event) => {
			if (event.code === "Space" && !event.repeat) next();
		};

		window.addEventListener("keydown", handleSpacebar);
		return () => {
			window.removeEventListener("keydown", handleSpacebar);
		};
	}, [next]);

	return (
		<button className="refresh" onMouseDown={next}>
			<span className="big"> Random Image </span>
			<span className="small"> (Press space or tap image) </span>
		</button>
	);
};
