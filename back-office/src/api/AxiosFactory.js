import axios from "axios";

class AxiosFactory{
    static createClient(baseURL,option={}){
        return axios.create({
            baseURL,
            timeout:option.timeout||2000,
            headers:option.headers||{},
            ...option,
        })
    }
    
    
}

export default AxiosFactory;

//en caso de que en un futuro ocupemos configurar mas cosas sobre las peticiones de axios docs de los parametros https://axios-http.com/es/docs/req_config