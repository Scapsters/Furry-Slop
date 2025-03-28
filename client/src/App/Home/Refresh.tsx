import React, { useCallback, useEffect } from "react";
import "./Refresh.css";

export const Refresh = ({
	advanceQueue,
	setWasBackUsed,
}: {
	advanceQueue: () => void;
	setWasBackUsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const refresh = useCallback(() => {
		setWasBackUsed(false);
		advanceQueue();
	}, [advanceQueue, setWasBackUsed]);

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
