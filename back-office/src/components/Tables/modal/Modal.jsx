import React from "react";
import { Dialog,  useTheme } from "@mui/material";  

const Modal = ({isOpen,handleClose,setAction,Component,row,action,callback})=>{
    const theme = useTheme(); 
    const { breakpoints } = theme;
 
    return <>
        <Dialog sx={{
            [breakpoints.down('sm')]:{
                marginBottom:"40%"
            },
          
        }} open={isOpen} onClose={()=>{setAction("reloded");handleClose()}} >
           {
            action==='delete'?
                <Component onClose={handleClose} id={row.id} action={action} setAction={setAction} onDelete={callback} />
            :
                <Component onClose={handleClose} setAction={setAction} action={action} row={row}   callback={callback}/>
           }
            
        </Dialog>
    </>
}

export default Modal