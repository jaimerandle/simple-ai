import React,{useEffect, useState} from "react";
import { Dialog, DialogContent, useTheme } from "@mui/material";  
import { useSelector } from "react-redux";

const Modal = ()=>{
    const error = useSelector((state)=>state.auth.error)
    const [open,setOpen] = useState(false)
    const theme = useTheme(); 
    const { breakpoints } = theme;
    
    useEffect(()=>{if(error === 401)setOpen(true)},[error])


    const handleClose = () =>{
        setOpen(false)
    }
    
    return <>
        <Dialog sx={{
            [breakpoints.down('sm')]:{
                marginBottom:"40%"
            }
        }} open={open} onClose={handleClose}>
            <DialogContent sx={{color:'error.main'}}>usuario/contrasena incorrectors!!!</DialogContent>
        </Dialog>
    </>
}

export default Modal