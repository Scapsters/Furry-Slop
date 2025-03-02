import React, { useCallback, useEffect } from "react";
import "./Refresh.css";

export const Refresh = ({ next , setWasBackUsed }) => {
	const refresh = useCallback(() => {
		setWasBackUsed(false);
		next();
	}, [next, setWasBackUsed]);

	useEffect(() => {
		const handleSpacebar = (event) => {
			if (event.code === "Space" && !event.repeat) refresh();
		};

		window.addEventListener("keydown", handleSpacebar);
		return () => {
			window.removeEventListener("keydown", handleSpacebar);
		};
	}, [refresh]);

	return (
		<button className="refresh" onMouseDown={refresh}>
			<span className="big"> Random Image </span>
			<span className="small"> (Press space or tap image) </span>
		</button>
	);
};
