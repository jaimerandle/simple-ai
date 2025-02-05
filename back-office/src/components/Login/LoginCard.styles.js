import { styled,CardContent,Box,Card } from "@mui/material";

export const StyledBox = styled(Box)(({theme})=>({
    width:'350px',
    textAlign:'center',
    margin:"auto",
    marginTop:"120px",
    [theme.breakpoints.down('sm')]:{
        marginTop:"180px",
        width:"70%"
    }
}))