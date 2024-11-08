import React from 'react';
import { Select, MenuItem, Button } from '@mui/material';
import Listado from "../assets/description.png";

function Header({ assistants, selectedAssistant, onAssistantChange, isMobile, navigate, startNewConversation }) {
  return (
    <div className="header-container">
      <h1 style={{ fontSize: "30px", color: "grey", marginTop: "10px" }}>Configuración asistente</h1>
      
      <Button 
        onClick={() => navigate("/home")}
        sx={{
          display: "flex",
          width: "20%",
          border: "1px solid grey",
          height: "50px",
          backgroundColor: "white",
          color: "grey",
          '&:hover': {
            backgroundColor: "rgb(67, 10, 98)", // Violeta
            color: "white",
          }
        }}
      >
        <img src={Listado} alt="" style={{ height: "20px" }} />
        {!isMobile && <p style={{ marginTop: "20px", marginLeft: "5px", fontSize: "15px" }}>Volver al dashboard</p>}
      </Button>
      
      <Button 
        onClick={startNewConversation}
        sx={{
          display: "flex",
          width: "20%",
          border: "1px solid grey",
          height: "50px",
          backgroundColor: "white",
          color: "grey",
          '&:hover': {
            backgroundColor: "rgb(67, 10, 98)",
            color: "white",
          }
        }}
      >
        Nueva Conversación
      </Button>

      <Select 
        value={selectedAssistant} 
        onChange={(e) => onAssistantChange(e.target.value)} 
        sx={{
          display: "flex",
          width: "20%",
          border: "1px solid grey",
          height: "50px",
          backgroundColor: "white",
          color: "grey",
          '&:hover': {
            backgroundColor: "rgb(67, 10, 98)",
            color: "white",
          }
        }}
      >
        {assistants?.map((assistant) => (
          <MenuItem key={assistant.id} value={assistant}>
            {assistant.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export default Header;
