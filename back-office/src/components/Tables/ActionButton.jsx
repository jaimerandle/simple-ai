import { StyledBox } from "./ActionButton.Styled";
import React from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

const ActionButton = ({action,select}) =>{
    

    return (
        <StyledBox>
            <DeleteForeverIcon onClick={()=>{
                select()
                action("delete")
               } 
            }/>
            <EditIcon onClick={()=>{
                select()
                action("update")}}
            />
        </StyledBox>
    )

}

export default ActionButton