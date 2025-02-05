import React from "react";
import { NavbarContainer } from "../home/Home.styles";
import Navbar from "../../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const Layout = () =>{
    return(
        <Box sx={{display:"flex"}}>
            
            <NavbarContainer>
                <Navbar />
            </NavbarContainer>
            <Box sx={{'flex':'2'}}>
              <Outlet/>  
            </Box>
            
        </Box>
    )
}

export {Layout}