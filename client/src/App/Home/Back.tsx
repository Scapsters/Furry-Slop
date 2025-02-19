import React, { useEffect } from "react";
export const Back = ({ back }) => {

	useEffect(() => {
		const handleBack = (event) => {
			if (event.code === "popstate" && !event.repeat) back();
		};

		window.addEventListener("popstate", handleBack);
		return () => {
			window.removeEventListener("popstate", handleBack);
		};
	}, [back]);

	return null
};