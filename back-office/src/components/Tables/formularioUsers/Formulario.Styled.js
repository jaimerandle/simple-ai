import { Box, styled } from "@mui/material";

export const StyledBox = styled(Box)(({theme})=>(
    {
        margin:'20px',
        display:'flex',
        gap:"2px",
        flexDirection:'column',
        width:'550px',
        height:'400px',
        alignItems:'center',
        justifyContent:'space-between'
    }
))