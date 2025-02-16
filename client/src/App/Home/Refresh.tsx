import React, { useEffect } from "react";
import "./Refresh.css";

export const Refresh = () => {

	const refresh = () => {}
	useEffect(() => {
		const handleSpacebar = (event) => {
			if (event.code === "Space") refresh();
		};

		window.addEventListener("keydown", handleSpacebar);
		return () => {
			window.removeEventListener("keydown", handleSpacebar);
		};
	}, [refresh]);

	return (
		<button className="refresh">
			<span className="big"> Random Image </span>
			<span className="small"> (Press space or tap image) </span>
		</button>
	);
};
