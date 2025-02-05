import { styled,Box,AppBar,Toolbar } from "@mui/material";

export const AppBarStyled = styled(AppBar)(({theme})=>({
    backgroundColor:theme.palette.background.paper
}))

export const ToolBarStyled = styled(Toolbar)(({theme})=>({
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-between",
    alignItems:"center",
    height:'100%'
}))