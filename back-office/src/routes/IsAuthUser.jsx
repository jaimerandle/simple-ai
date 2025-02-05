import React, { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";

const  IsAuthUser = ({auth=false,children}) => {
    const isAuth = useSelector((state)=>state.auth.isAuthenticated)
    console.log(isAuth)

    if(auth){
        return isAuth?children ||<Outlet/>  :<Navigate to='/login' />
  }
         return !isAuth? children||<Outlet/> :<Navigate to='/home' />



}

export default IsAuthUser;