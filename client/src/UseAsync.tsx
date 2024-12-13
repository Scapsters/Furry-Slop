import { useState, useEffect, type SetStateAction } from "react";

export const useAsync = <T,>(dataPromise: Promise<T>, dependency: any, defaultValue: T): AsyncData<T> => {
        const [data, setData] = useState<T>(defaultValue)
        const [isLoading, setIsLoading] = useState(true)
        useEffect(
            () => {
                const awaitData = async () => {
                    setIsLoading(true);
                    try             { setData(await dataPromise); } 
                    catch (error)   { console.error("Error fetching food data:", error); } 
                    finally         { setIsLoading(false); }
                };
                awaitData()
            }, [dependency])
        return [
            [data, setData],
            [isLoading, setIsLoading]
        ]
    }

export type AsyncData<T> = [
    [T, React.Dispatch<SetStateAction<T>>], 
    [boolean, React.Dispatch<SetStateAction<boolean>>]
]

export default useAsync
