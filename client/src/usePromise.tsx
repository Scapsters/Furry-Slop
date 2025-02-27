import { useEffect, useState } from "react";

export const usePromise = <T,>(promise: Promise<T> | undefined, defaultValue: T): [T, boolean] => {
    const [data, setData] = useState<T>(defaultValue);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const awaitData = async () => {
            setIsLoading(true);

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
}