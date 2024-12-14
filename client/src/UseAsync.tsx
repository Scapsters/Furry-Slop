import { useState, useEffect } from "react";

export const useAsync = <T,>(promiseFunction: () => Promise<T>, defaultValue: T): [T, boolean] => {
        const [data, setData] = useState<T>(defaultValue)
        const [isLoading, setIsLoading] = useState(true)
        
        useEffect(() => {
            const awaitData = async () => {
                setIsLoading(true);
                try             { setData(await promiseFunction()); } 
                catch (error)   { console.error("Error fetching data:", error); } 
                finally         { setIsLoading(false); }
            };
            awaitData()
        }, [promiseFunction] )
        
            return [data, isLoading]
    }

export default useAsync
