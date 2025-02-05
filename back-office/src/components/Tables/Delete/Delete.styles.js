import { styled,Box } from "@mui/material";

export const StyledBox = styled(Box)(({theme})=>(
    {
        
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        padding:'20px',
        gap:'20px'
    }))

export const StyledBoxButton = styled(Box)(({theme})=>({
    display:'flex',
    gap:'20px'
}))