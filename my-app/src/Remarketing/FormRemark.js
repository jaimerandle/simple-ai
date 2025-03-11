import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { CalendarToday } from '@mui/icons-material';
import { format } from 'date-fns'; // Para formatear la fecha en formato de texto

const Formulario = ({ onCampaignSaved }) => {
  const [message, setMessage] = useState('');
  const [daysAfter, setDaysAfter] = useState(''); // Campo para seleccionar los días
  const [startTime, setStartTime] = useState(null); // Hora de inicio
  const [endTime, setEndTime] = useState(null); // Hora de fin
  const [openModal, setOpenModal] = useState(false); // Estado para controlar la apertura del modal
  const [campaignDate, setCampaignDate] = useState(new Date()); // Fecha de creación (fecha actual)
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleDaysChange = (e) => {
    setDaysAfter(e.target.value);
  };

  const handleStartTimeChange = (newTime) => {
    setStartTime(newTime);
  };

  const handleEndTimeChange = (newTime) => {
    setEndTime(newTime);
  };

  const handleSendCampaign = () => {
    if (message.trim() && daysAfter && startTime && endTime) {
      const currentDate = new Date();
      const targetDate = new Date(currentDate.setDate(currentDate.getDate() + parseInt(daysAfter)));

      // Ajustar las horas de inicio y fin
      const startDateTime = new Date(targetDate.setHours(startTime.getHours(), startTime.getMinutes()));
      const endDateTime = new Date(targetDate.setHours(endTime.getHours(), endTime.getMinutes()));

      const newCampaign = {
        id: Date.now(),
        message,
        campaignDate,  // Fecha de creación
        startDateTime,
        endDateTime,
      };

      const storedCampaigns = JSON.parse(sessionStorage.getItem('campaigns')) || [];
      storedCampaigns.push(newCampaign);
      sessionStorage.setItem('campaigns', JSON.stringify(storedCampaigns));

      onCampaignSaved();

      setMessage('');
      setDaysAfter('');
      setStartTime(null);
      setEndTime(null);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cerrar el modal
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60%' }}>
      <TextField
        label="Nueva campaña"
        multiline
        rows={4}
        value={message}
        onChange={handleMessageChange}
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: '16px',
          '& .MuiInputLabel-root': {
            color: 'black',
          },
          '& .MuiInputBase-root': {
            color: 'black',
          },
        }}
      />

      {/* Mostrar la fecha de creación (Fecha actual) */}
      <TextField
        label="Fecha de creación"
        value={format(campaignDate, 'dd/MM/yyyy')}
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: '16px',
          '& .MuiInputLabel-root': {
            color: 'black',
          },
          '& .MuiInputBase-root': {
            color: 'black',
          },
        }}
        InputProps={{
          readOnly: true, // Hace que el campo sea solo lectura
        }}
      />

      {/* Campo para ingresar los días */}
      <TextField
        label="Dentro de X días"
        value={daysAfter}
        onChange={handleDaysChange}
        variant="outlined"
        fullWidth
        type="number"
        sx={{
          marginBottom: '16px',
          '& .MuiInputLabel-root': {
            color: 'black',
          },
          '& .MuiInputBase-root': {
            color: 'black',
          },
        }}
      />

      {/* Botón para abrir el modal para seleccionar la franja horaria */}
      <Button
        variant="outlined"
        onClick={handleOpenModal}
        sx={{
          marginBottom: '16px',
          '& .MuiButton-root': {
            color: 'black',
          },
        }}
      >
        Franja horaria
      </Button>

      {/* Modal con TimePicker */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="50%" style={{ marginTop: '50px' }}>
        <DialogTitle>Seleccionar Hora</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* Hora de inicio */}
            <TimePicker
              label="Hora de inicio"
              value={startTime}
              onChange={handleStartTimeChange}
              renderInput={(params) => <TextField {...params} sx={{ marginBottom: '16px' }} />}
              sx={{
                marginTop: "15px",
                '& .css-qp3f9d-MuiFormLabel-root-MuiInputLabel-root': {
                  color: 'black !important',
                },
              }}
            />
            {/* Hora de fin */}
            <TimePicker
              label="Hora de fin"
              value={endTime}
              onChange={handleEndTimeChange}
              renderInput={(params) => <TextField {...params} sx={{ marginTop: '16px' }} />}
              sx={{
                marginTop: "15px",
                '& .css-qp3f9d-MuiFormLabel-root-MuiInputLabel-root': {
                  color: 'black !important',
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleCloseModal} // Cerrar el modal al confirmar la hora
            color="primary"
            disabled={!startTime || !endTime} // Desactivar el botón si no se selecciona hora de inicio o fin
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSendCampaign}
        sx={{ width: '40%', marginBottom: '16px' }}
      >
        Enviar Campaña
      </Button>
    </Box>
  );
};

export default Formulario;
