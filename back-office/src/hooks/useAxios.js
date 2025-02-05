import { useCallback, useEffect, useState } from "react"

export function useAxios(fetchFunction,dependencies){
    const [data,setData]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError] = useState(null)
    
    const reAxios = useCallback(async()=>{
        setLoading(true)
        try{
            const result = await fetchFunction(...dependencies)
            setData(result)
            setError(null)
        }catch(err){
            setError(err)
        }finally{
            setLoading(false)
        }
    },[fetchFunction,...dependencies])



    return {
        data,
        loading,
        error,
        reAxios,
    }
}