import { Box, styled } from "@mui/material";    

export const StyledBox = styled(Box)(({theme})=>(
    {
        display:"flex",
        justifyContent:"space-evenly",
        alignItems:"center",
       textAlign:"center ",
       marginTop:"15px"
    }
))