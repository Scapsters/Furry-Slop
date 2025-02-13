import { useState, useEffect } from "react";

export const DEV = true;
export const API = DEV ? 'http://localhost:5000/' : 'https://furryslop.com/';

const awaitServer = async <T,>(serverPath: string): Promise<T> => {
    console.log("Fetching data from server:", serverPath)
    console.log("API:", API)
    const response = await fetch(`${API}${serverPath}`)
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
