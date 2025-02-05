import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledBox } from "./Formulario.Styled";
import { useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ButtonToggle from "../../buttonToggle/ButtonToggle";


const FormularioBalley= ({ onClose, setAction, action, row, callback }) => {
  const [confirmForm, setConfirmForm] = useState(false);
  const [response, setResponse] = useState(row || {});
  const [submissionError, setSubmissionError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const { data, loading, error } = useFetch(
        confirmForm ? callback : () => Promise.resolve(null),
        action === "update"
            ? [{ enabled: response.enabled }, token, response.id]
            : [response, token]
    );
 

    useEffect(() => {
      if (error) {
          setConfirmForm(false);  
          setSubmissionError("Error al registrar elemento. Intenta de nuevo.");
      }
      }, [error]);
    
       

  const handleSubmit = (e) => {
    e.preventDefault();
    // const date = new Date()
    // response.last_updated=date.toDateString();
    setConfirmForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponse((prev) => ({ ...prev, [name]: value }));
  };

    
  const handleClose = () => {
    setAction("reloded");
    onClose();
  };

 
  const renderForm = () => (
    <StyledBox component="form" onSubmit={handleSubmit}>

     {action ==="create" && <TextField
        required
        type="tel"
        label="Phone number"
        name="phone_number"
        value={response.phone_number || ""}
        onChange={handleChange}
        fullWidth
      />}
            <ButtonToggle 
      label="Enabled"
      value={response.enabled || ''}
      onChange={(newValue)=>{setResponse((prev) => ({ ...prev, ['enabled']: newValue }));}}
      />
  
     
      {loading && <Typography>Cargando...</Typography>}
      {error && <Typography color="error">{submissionError}</Typography>}
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

export default FormularioBalley;
