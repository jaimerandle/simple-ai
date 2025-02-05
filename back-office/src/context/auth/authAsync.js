import { createAsyncThunk } from "@reduxjs/toolkit";    
import AuthClient from "../../api/auth";

const login = createAsyncThunk(
    "auth/Login",
    async({email,password},{rejectWithValue})=>{
        try{  
            console.log('data')         
            const response = await AuthClient.login(email,password);  
            
            
            return response;
        }catch(err){
            return rejectWithValue(err.data||"error data");
           
        }
    }
)

export default login;