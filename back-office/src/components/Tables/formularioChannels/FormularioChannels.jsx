import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledBox } from "../Formulario.Styled";
import { useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OperationBasic from "../../../pages/home/logicHome";
import DropDown from "../../DropDown/DropDown";
import CodeEditor from "../../CodeEditor/CodeEditor";
import ChannelTypeSelect from "../../ChannelTypeSelect";
const clientOp = new OperationBasic("clients");
const assistantOp = new OperationBasic('assistants')

const FormularioChannels= ({ onClose, setAction, action, row, callback }) => {
  const [confirmForm, setConfirmForm] = useState(false);
  const [response, setResponse] = useState(row || {});
   const [submissionError, setSubmissionError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const { data, loading, error } = useFetch(
        confirmForm ? callback : () => Promise.resolve(null),
        action === "update"
            ? [{ type: response.type, config: response.config, assistant_id: response.assistant_id }, token, response.id]
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
    setConfirmForm(true);
    setSubmissionError(null);  
  };


    
  const handleDrop = (name, value) => {
    setResponse((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setAction("reloded")
    onClose();

  };

  const handleJson = (value) => {
    setResponse((prev) => ({ ...prev, config: value }));
  };

  const handleType = (value) =>{
    setResponse((prev)=>({...prev,type:value.target.value}))
  }

  const renderForm = () => (
    <StyledBox component="form" onSubmit={handleSubmit}>
        {action === "create"&& <DropDown
        token={token}
        label="Client ID"
        value={response.client_id}
        onChange={(value) => handleDrop("client_id", value)}
        fetchOptions={clientOp.getTables}
      />}
      <ChannelTypeSelect
        value={response.type}
        onChange={handleType}
        required
      
      />
  
      {response.client_id &&<DropDown
        token={token}
        label="Assistant id"
        value={response.assistant_id}
        onChange={(value) => handleDrop("assistant_id", value)}
        fetchOptions={(token)=>assistantOp.getItems(`assistantsM/${response.client_id}`,token)}
      />}
      {!response.client_id && <Typography sx={{color:"red" ,fontSize:"17px", marginRight:"415px"}}>Assistant Id</Typography>}
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

export default FormularioChannels;
