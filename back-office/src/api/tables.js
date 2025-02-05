// import ApiClientManager from "./apiClientManager"

// class ApiService{

//     tables

//      constructor(){
//         this.tables =  ApiClientManager.getClient('authApi')
//      }
  
//     async getTable(nameTable){
//         try{
//            const result =  await this.tables.post(`/${nameTable}`,{})
//            console.log(result)
//             console.log(ApiClientManager.instance['authApi'].defaults)
//             return(result.data)

//         }catch(error){
//             throw { message:error.message, data:error.response.data ,status:error.response.status}
//         }
//     }

// }

// const tablesApi = new ApiService();

// export default tablesApi;