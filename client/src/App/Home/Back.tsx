import React, { useEffect } from "react";
export const Back = ({ back }) => {

	useEffect(() => {
		const handleBack = (event: PopStateEvent) => {
			console.log("URL changed to: " + window.location.href);
		}

		window.addEventListener("popstate", handleBack);
		return () => {
			window.removeEventListener("popstate", handleBack);
		};
	}, [back]);

	return null
};