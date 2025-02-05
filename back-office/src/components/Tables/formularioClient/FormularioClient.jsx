import { Box, TextField, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledBox } from "../Formulario.Styled";
import { useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CodeEditor from "../../CodeEditor/CodeEditor";

const FormularioClient = ({ onClose, setAction, action, row, callback }) => {
    const [confirmForm, setConfirmForm] = useState(false);
    const [response, setResponse] = useState(row || {});
    const [submissionError, setSubmissionError] = useState(null);
    const token = useSelector((state) => state.auth.token);

    const { data, loading, error } = useFetch(
        confirmForm ? callback : () => Promise.resolve(null),
        action === "update"
            ? [{ name: response.name, email: response.email, details: response.details }, token, response.id]
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResponse((prev) => ({ ...prev, [name]: value }));
    };

   



    const handleClose = () => {
        setAction("reloded")
        onClose();
    };

    const handleJson = (value) => {
        setResponse((prev) => ({ ...prev, details: value }));
    };

    return (
        <>
            <Typography sx={{ textAlign: 'center', margin: '10px' }}>
                {action === 'update' ? 'Actualizar' : 'Registrar'}
            </Typography>
            {!data ? (
                <StyledBox component="form"  onSubmit={handleSubmit}>
                    <TextField
                        required
                        label="Nombre"
                        name="name"
                        value={response.name || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        required
                        type="email"
                        label="Email"
                        name="email"
                        value={response.email || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    {action === 'create' && (
                        <TextField
                            label="Code"
                            name="code"
                            value={response.code || ""}
                            onChange={handleChange}
                            fullWidth
                            disabled={action === 'update'}
                        />
                    )}
                    <CodeEditor
                        data={response.details}
                        label="Details"
                        change={handleJson}
                    />
                    {loading && <p>Cargando...</p>}
                    {submissionError && <p style={{ color: 'red' }}>{submissionError}</p>}
                    <Button variant="contained" color="primary" type="submit" disabled={loading}>
                        Enviar
                    </Button>
                </StyledBox>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px', marginTop: "0px" }}>
                    <Typography sx={{ textAlign: 'center', margin: '20px' }}>
                        {action === 'update' ? '¡Actualizado con éxito!' : '¡Registrado con éxito!'}
                    </Typography>
                    <CheckCircleOutlineIcon sx={{ textAlign: 'center', margin: 'align', fontSize: '40px' }} />
                    <Button onClick={handleClose}>Okay</Button>
                </Box>
            )}
        </>
    );
};

export default FormularioClient;
