import {Button,Grid,Input,TextField,Typography,useMediaQuery,Box,} from "@mui/material";
  import React, { useState } from "react";
  import { useParams } from "react-router-dom";
  import Navbar from "../../Home/Navbar";
  import Allianz from "../../assets/seguros/Allianz.svg";
  import Caja from "../../assets/seguros/Caja.svg";
  import Federacion from "../../assets/seguros/Federacion.png";
  import Galicia from "../../assets/seguros/Galicia.webp";
  import Mapfre from "../../assets/seguros/Mapfre.webp";
  import Meridional from "../../assets/seguros/Meridional.png";
  import Rivadavia from "../../assets/seguros/Rivadavia.png";
  import Sancor from "../../assets/seguros/Sancor.svg";
  import  Smg from "../../assets/seguros/Smg.svg";
  import Zurich from "../../assets/seguros/Zurich.svg"
  
  const Aseguradora = () => {
    const { id } = useParams();
    const isMobile = useMediaQuery("(max-width:750px)");
    const [user, setUser] = useState({ email: "", password: "" });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUser((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Datos enviados:", user);
      
    };
  
    const img = [Allianz,Caja,Federacion,Galicia,Mapfre,Meridional,Rivadavia,Sancor,Smg,Zurich];
  
    return (
      <Box>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 100px)",  
            padding: isMobile ? "20px" : "50px",
            background: "#f5f5f5",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "50px",
              alignItems: "center",
              background: "white",
              padding: "20px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <Box>
              <img
                src={img[9]}
                alt="logo"
                style={{
                  maxWidth: "150px",
                  objectFit: "contain",
                }}
              />
            </Box>
  
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  minWidth: isMobile ? "100%" : "300px",
                }}
              >
                <Grid item xs={12}>
                  <Typography variant="body1">Email</Typography>
                  <Input
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Ingresa tu correo"
                    onChange={handleChange}
                    value={user.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Contraseña</Typography>
                  <Input
                    fullWidth
                    name="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    onChange={handleChange}
                    value={user.password}
                    required
                  />
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Enviar
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    );
  };
  
  export { Aseguradora };