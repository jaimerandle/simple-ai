import AuthClient from "../../api/auth";

class OperationBasic{

    constructor(table){
        this.table = table
    }

    getTables = async (token) =>{
        try{
            const result = await AuthClient.getTable(this.table,token);

            return result   
        }catch(err){
           throw err
        }
    }

    deleteItem = async(id,token) =>{
        try{
             const result = await AuthClient.deleteElement(this.table,id,token)
             return result
        }catch(err){
            throw err
        }
        
    }

    editItem = async(row,token,id)=>{
        try{
            console.log(row)
            const result = await AuthClient.updateElement(this.table,row,token,id)
            return result
       }catch(err){s
           throw err
       }
        
    }

    createItem = async(item,token)=>{
        try{
            const result = await AuthClient.createItem(this.table,item,token)
            return result
        }catch(err){
            throw err
        }
    }

    getItems = async(ruta,token)=>{
        try{
            const result = await AuthClient.getTable(ruta,token)
            return result
        }catch(error){
            throw error
        }

    }
}

export default OperationBasic;