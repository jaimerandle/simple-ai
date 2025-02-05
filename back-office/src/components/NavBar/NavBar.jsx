import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBarStyled, ToolBarStyled } from "./NavBar.Styled";
import { useDispatch } from "react-redux";
import { logout } from "../../context/auth/userSlice";
import {useNavigate } from "react-router-dom";    

function Navbar() {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const dispatch =  useDispatch();
   
  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      <AppBarStyled position="static" sx={{width:'50px',height:'100vh'}}>
        <ToolBarStyled>
        <IconButton sx={{}}  color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon sx={{color:'white'}} />
            </IconButton>
             <IconButton sx={{marginBottom:'40px'}} onClick={()=>dispatch(logout())}>
                <LogoutIcon sx={{color:'white'}}/>
             </IconButton>
        </ToolBarStyled>
      </AppBarStyled>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div style={{ width: 250 }}>
          <IconButton onClick={toggleDrawer(false)}  style={{ marginLeft: "auto" }} >
            <CloseIcon sx={{color:'white'}} />
          </IconButton>
          <List>
            <ListItem  onClick={() => navigate("/home")} button>
              <ListItemText primary="Clients" />
            </ListItem>
            <ListItem onClick={() => navigate("/users")}  button>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem onClick={() => navigate("/assistants")} button>
              <ListItemText primary="Assistants" />
            </ListItem>
            <ListItem onClick={() => navigate("/channels")} button>
              <ListItemText primary="Channels" />
            </ListItem>
            <ListItem button onClick={() => navigate("/Baileys")}>
              <ListItemText primary="BaileysDevice" />
            </ListItem>
            <ListItem button onClick={() => navigate("/periodicJobs")}>
              <ListItemText primary="PeriodicJobs" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;