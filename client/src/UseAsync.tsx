import { useState, useEffect } from "react";

const awaitServer = async <T,>(serverPath: string): Promise<T> => {
    const response = await fetch(`http://localhost:5000/${serverPath}`)
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
}

export const useAsync = <T,>(serverPath: string, defaultValue: T): [T, boolean] => {
    const [data, setData] = useState<T>(defaultValue)
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const awaitData = async () => {
            setIsLoading(true);
            try             { setData(await awaitServer(serverPath)); } 
            catch (error)   { console.error("Error fetching data:", error); } 
            finally         { setIsLoading(false); }
        };
        awaitData()
    }, [serverPath])
    
        return [data, isLoading]
}



export default useAsync
