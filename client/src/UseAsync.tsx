import { useState, useEffect, useMemo } from "react";

export const DEV = false;
export const API = DEV ? "http://localhost:5000/" : "https://furryslop.com/";

const awaitServer = async <T,>(serverPath: string): Promise<T> => {
	const response = await fetch(`${API}${serverPath}`);
	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	return await response.json();
};

export const useAsync = <T,>(
	serverPath: string,
	defaultValue: T
): [T, boolean] => {
	const [data, setData] = useState<T>(defaultValue);
	const [isLoading, setIsLoading] = useState(true);

    const serverPathMemo = useMemo(() => serverPath, [serverPath]);

	useEffect(() => {
		const awaitData = async () => {
			setIsLoading(true);
			try {
				setData(await awaitServer(serverPathMemo));
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};
		awaitData();
	}, [serverPathMemo]);

	return [data, isLoading];
};
