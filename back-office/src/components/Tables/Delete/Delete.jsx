import { Button, Typography,Box} from "@mui/material";
import { StyledBox,StyledBoxButton } from "./Delete.styles";
import { useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import React from "react";

const Delete = ({onClose,onDelete,id,setAction,action})=>{
    const token = useSelector((state)=>state.auth.token)
    


    const closeControl =()=>{ 
        onClose();  
        setAction("");

    }

    const deleteItem = () =>{
        onDelete(id,token);
        closeControl();
        setAction("sDelete");
    }

    return(
        <StyledBox>
            <Typography sx={{color:'red'}}>Estas seguros de querer ELIMINAR este Elemento?</Typography>
            <StyledBoxButton>
                <Button onClick={deleteItem}>Si</Button>
                <Button onClick={closeControl}>No</Button>
            </StyledBoxButton>
        </StyledBox>
    )
    
}

export default Delete