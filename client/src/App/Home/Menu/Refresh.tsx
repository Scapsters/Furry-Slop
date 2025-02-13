import React, { useContext, useEffect } from "react";
import "./Refresh.css";
import { refreshContext } from "../../Home.tsx";

export const Refresh = () => {
	const refresh = useContext(refreshContext);

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
		<button className="refresh" onClick={refresh}>
			<span className="big"> Random Image </span>
			<span className="small"> (Press space or tap image) </span>
		</button>
	);
};
