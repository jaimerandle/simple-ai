import ApiClientManager from "./apiClientManager"
import {store} from "./../context/store"
class ApiService{

    authClient

     constructor(){
        this.authClient =  ApiClientManager.getClient('authApi',"https://6wqwjnilkygbweybic5ywpqmse0akwlt.lambda-url.us-east-1.on.aws",{})
        
     }
  
    async login(email,pass){
        try{
           const result =  await this.authClient.post('/login',{email,pass})
           //agregar header
           return(result.data)
        }catch(error){
            throw { message:error.message, data:error.response.data ,status:error.response.status}
        }
    }

    async auth(token){
        this.authClient.defaults.headers['Authorization'] = `Bearer ${token}`
    }

    async getTable(name,token){
        try{
            this.auth(token)
            const result = await this.authClient.get(`/${name}`) 
            return (result.data)
        }catch(error){
            throw { message:error.message, data:error.response.data ,status:error.response.status} 
        }
    }

    
    async deleteElement(name,id,token){
        try{
            this.auth(token)
            const result = await this.authClient.delete(`/${name}/${id}`)
            return result
          
        }catch(error){
            throw { message:error.message, data:error.response.data ,status:error.response.status}
        }
    }

    async updateElement(name,row,token,id){
        try{
            this.auth(token)
             const result = await this.authClient.put(`/${name}/${id}`,row)
             return result;
        }catch(error){
            throw error
        }
    }

    async createItem(name,item,token){
        try{
            this.auth(token)
            this.authClient.defaults.headers['Authorization'] = `Bearer ${token}`;
             const result = await this.authClient.post(`/${name}`,item)
             return result
        }catch(err){
            throw err
        }
    }

}

const AuthClient = new ApiService();

export default AuthClient;