import React, { useState } from "react";
import { Menu, MenuItem, IconButton, useMediaQuery } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const DropdownMenu=() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery('(max-width:600px)')
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Botón con ícono para abrir el menú */}
      <IconButton
        aria-label="more"
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon sx={!isMobile?{color:"white"}:{}}/> {/* Icono de "más opciones" */}
      </IconButton>

      {/* Menú desplegable */}
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "dropdown-button",
        }}
        sx={isMobile?{
          zIndex:999999,
          mt:-7
        }:{
          zIndex:999999,
          mt:2
        }}
      >
        <MenuItem onClick={handleClose}>Opción 1</MenuItem>
        <MenuItem onClick={handleClose}>Opción 2</MenuItem>
        <MenuItem onClick={handleClose}>Opción 3</MenuItem>
      </Menu>
    </div>
  );
}

export {DropdownMenu}