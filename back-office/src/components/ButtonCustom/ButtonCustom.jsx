import React from "react";
import {StyledButton} from './ButtonCustom.styles';

export const ButtonGeneralCustom = ({label,onClick,typed,w="50%"}) =>{
    return(
        <StyledButton onClick={onClick?onClick:()=>{}} type={typed} w={w}>
        {label}
        </StyledButton>
    )

}

 