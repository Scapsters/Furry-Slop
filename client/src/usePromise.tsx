import { useEffect, useState } from "react";

export const usePromise = <T,>(
	promise: Promise<T> | null,
	defaultValue: T | null
): [T | null, boolean] => {
	const [data, setData] = useState<T | null>(defaultValue);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const awaitData = async () => {
			if (!promise) {
				setIsLoading(false);
				return;
			}

			try {
				setData(await promise);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};
		awaitData();
	}, [promise]);

	return [data, isLoading];
};
