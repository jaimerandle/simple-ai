import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { updateConversationMetadata } from '../services/bffService';

const getColorForState = (state) => {
  switch (state) {
    case 'alta':
      return 'red';
    case 'media':
      return 'orange';
    case 'baja':
      return 'green';
    default:
      return 'white';
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
          textShadow: '1px 1px 1px black',
          '& .MuiSelect-icon': {
            color: getColorForState(state),  // Aplicar color al ícono del select
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      >
        <MenuItem value="alta" style={{ color: 'red' }}>Alta</MenuItem>
        <MenuItem value="media" style={{ color: 'orange' }}>Media</MenuItem>
        <MenuItem value="baja" style={{ color: 'green' }}>Baja</MenuItem>
      </Select>
    );
  };

export default StateSelector;
