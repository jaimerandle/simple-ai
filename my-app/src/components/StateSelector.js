import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { updateConversationMetadata } from '../services/bffService';

const getColorForState = (state) => {
  switch (state) {
    case 'Sin Respuesta':
      return 'grey';
    case 'Respondio':
      return 'orange';
    case 'Llamado':
      return 'green';
    case'Meet':
      return 'aqua';
    case'Cliente':
      return 'red';
    case'Marketing':
      return 'Black';
  }
};

const StateSelector = ({ id, initialState, onStateChange }) => {
    const [state, setState] = useState(initialState);
  
    const handleChange = async (event) => {
      const newState = event.target.value;
      setState(newState);
      const token = localStorage.getItem('authToken');
      try {
        await updateConversationMetadata(id, { state: newState }, token);
  
        // Llamar a la función para actualizar el estado en SimpleTable
        onStateChange(id, newState);
  
        console.log('Estado actualizado exitosamente');
      } catch (error) {
        console.error('Error al actualizar el estado:', error.message);
      }
    };
  
    return (
      <Select
        value={state}
        onChange={handleChange}
        variant="standard"
        fullWidth
        disableUnderline
        sx={{
          color: getColorForState(state),  // Aplicar color basado en el estado seleccionado
          fontWeight: 'bold',
          '& .MuiSelect-icon': {
            color: getColorForState(state),  // Aplicar color al ícono del select
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          width:"100%"
        }}
      >
        <MenuItem value="Sin Respuesta" style={{ color: 'grey' }}>Sin Rta</MenuItem>
        <MenuItem value="Respondio" style={{ color: 'orange' }}>Respondio</MenuItem>
        <MenuItem value="Llamado" style={{ color: 'green' }}>Llamado</MenuItem>
        <MenuItem value="Meet" style={{ color: 'aqua' }}>Meet</MenuItem>
        <MenuItem value="Cliente" style={{ color: 'red' }}>Cliente</MenuItem>
        <MenuItem value="Marketing" style={{ color: 'black' }}>Marketing</MenuItem>
      </Select>
    );
  };

export default StateSelector;
