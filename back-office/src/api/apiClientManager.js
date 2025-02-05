import { logout } from "../context/auth/userSlice";
import { store } from "../context/store";
import AxiosFactory from "./AxiosFactory";

class ApiClientManager{
    static instance = {};

    static getClient(name,baseUrl,auth={},option={}){ 
        if(!this.instance[name]){
            const headers = {
                ...option.headers,
                ...(auth.type === 'header' && auth.key?{Authorization:`Bearer ${auth.key}`}:{})
            }

            const params = {
                ...option.params,
                ...(auth.type == 'query' && auth.key? {apiKey:auth.key}:{})
            }

            this.instance[name] = AxiosFactory.createClient(baseUrl,{...option,headers,params});
            this.inteceptor(name)
        }
        return this.instance[name];
    }

    static setAuth(name,auth){
        this.instance[name].defaults.headers['Authorization'] = `Bearer ${auth}`
    }
    
    static inteceptor(name){
        this.instance[name].interceptors.response.use(
            response => response,
            async (err)=>{
                if(err.response?.status === 401){
                   store.dispatch(logout())
                }
                return Promise.reject(err)
            }
        )
    }
    
}

export default ApiClientManager;