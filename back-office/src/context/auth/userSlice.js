import { createSlice } from "@reduxjs/toolkit";
import  login  from "./authAsync"

const initialState = {
    user:null,
    loading:false,
    error:null,
    isAuthenticated:false,
    token:null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.isAuthenticated=false;
            state.error=null;
            state.token= null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(login.pending,(state)=>{
            state.loading =true;
            state.error=null;
        })  
        .addCase(login.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = true;
            state.token= action.payload?.token

        })
        .addCase(login.rejected,(state,action)=>{
            state.loading =false;
            state.error = action.payload.error;
        })
    }
})

export const {logout} = authSlice.actions;

export default authSlice.reducer;