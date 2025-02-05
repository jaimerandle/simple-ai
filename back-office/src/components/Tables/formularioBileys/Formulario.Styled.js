import { Box, styled } from "@mui/material";

export const StyledBox = styled(Box)(({theme})=>(
    {
        margin:'20px',
        display:'flex',
        flexDirection:'column',
        width:'300px',
        height:'250px',
        alignItems:'center',
        justifyContent:'space-between'
    }
))