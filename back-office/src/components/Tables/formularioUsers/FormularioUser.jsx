import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledBox } from "./Formulario.Styled";
import { useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OperationBasic from "../../../pages/home/logicHome";
import DropDown from "../../DropDown/DropDown";

const operaciones = new OperationBasic("clients");

const FormularioUser = ({ onClose, setAction, action, row, callback }) => {
  const [confirmForm, setConfirmForm] = useState(false);
  const [response, setResponse] = useState(row || {});
  const token = useSelector((state) => state.auth.token);
  const {error,data,loading} = useFetch(confirmForm ? callback : () => Promise.resolve(null),
   action === "update"
    ?[{client_id:response.client_id,name:response.name,email:response.email},token,response.id]
    :[response,token]);

   
      useEffect(() => {
          if (error) {
              setConfirmForm(false);  
          }
      }, [error]);

  useEffect(() => {
    if (row) {
      setResponse(row);
    }
  }, [row]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponse((prev) => ({ ...prev, [name]: value }));
  };

    
  const handleDrop = (name, value) => {
    setResponse((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setAction("reloded");
    onClose();
  };

 
  const renderForm = () => (
    <StyledBox component="form"  onSubmit={handleSubmit}>
       { action==="create"&&<DropDown
        token={token}
        label="Client ID"
        value={response.client_id}
        onChange={(value) => handleDrop("client_id", value)}
        fetchOptions={operaciones.getTables}
      />}
      <TextField
      autoComplete="off"
        required
        label="Name"
        name="name"
        value={response.name || ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
      autoComplete="new-password"
        required
        label="Email"
        name="email"
        value={response.email || ""}
        onChange={handleChange}
        fullWidth
      />
      {action === "create" && (
        <TextField
          autoComplete="new-password"
          required
          label="Password"
          type="password"
          name="password"
          value={response.password || ""}
          onChange={handleChange}
          fullWidth
        />
      )}
      {loading && <Typography>Cargando...</Typography>}
      {error && <Typography color="error">Error al registrar elemento. Intente de nuevo.</Typography>}
      <Button variant="contained" color="primary" type="submit">
        Enviar
      </Button>
    </StyledBox>
  );

  const renderSuccess = () => (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px", marginTop: "0px" }}>
      <Typography sx={{ textAlign: "center", margin: "20px" }}>
        {action === "update" ? "¡Se actualizó con éxito!" : "¡Se registró con éxito!"}
      </Typography>
      <CheckCircleOutlineIcon sx={{ fontSize: "40px" }} />
      <Button onClick={handleClose}>Okay</Button>
    </Box>
  );

  return (
    <>
      <Typography sx={{ textAlign: "center", margin: "10px" }}>
        {action === "update" ? "Actualizar" : "Registrar"}
      </Typography>
      {!data ? renderForm() : renderSuccess()}
    </>
  );
};

export default FormularioUser;
