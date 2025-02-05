import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledBox } from "../Formulario.Styled";
import { useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OperationBasic from "../../../pages/home/logicHome";
import DropDown from "../../DropDown/DropDown";
import CodeEditor from "../../CodeEditor/CodeEditor";

const clientOp = new OperationBasic("clients");

const FormularioPeriodic= ({ onClose, setAction, action, row, callback }) => {
  const [confirmForm, setConfirmForm] = useState(false);
  const [response, setResponse] = useState(row || {});
  const token = useSelector((state) => state.auth.token);
    const [submissionError, setSubmissionError] = useState(null);
  const { data, loading, error } = useFetch(
      confirmForm ? callback : () => Promise.resolve(null),
      action === "update"
          ? [{ name: response.name, schedule: response.schedule, config: response.config }, token, response.id]
          : [response, token]
  );


    useEffect(() => {
        if (error) {
            setConfirmForm(false);  
            setSubmissionError("Error al registrar elemento. Intenta de nuevo.");
        }
    }, [error]);

  useEffect(() => {
    if (row) {
      setResponse(row); 
    }
  }, [row]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // const date = new Date()
    // response.last_updated=date.toDateString();
    console.log(response)
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

  const handleJson = (value) => {
    setResponse((prev) => ({ ...prev, config: value }));
};

 
  const renderForm = () => (
    <StyledBox component="form" onSubmit={handleSubmit}>
        {action==='create'&&<DropDown
        token={token}
        label="Client ID"
        value={response.client_id}
        onChange={(value) => handleDrop("client_id", value)}
        fetchOptions={clientOp.getTables}
      />}
      <TextField
        required
        label="Name"
        name="name"
        value={response.name || ""}
        onChange={handleChange}
        fullWidth
      />
    <TextField
        required
        label="Schedule"
        name="schedule"
        value={response.schedule || ""}
        onChange={handleChange}
        fullWidth
      />
      <CodeEditor
        data={response.config}
        label="Config"
        change={handleJson}
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

export default FormularioPeriodic;
