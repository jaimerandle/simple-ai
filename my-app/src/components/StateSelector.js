import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { updateConversationMetadata } from '../services/bffService';

const getColorForState = (state) => {
  switch (state) {
    case 'Sin Respuesta':
      return 'grey';
    case 'Respondio':
      return 'orange';
    case 'Llamado':
      return 'green';
    case 'Meet':
      return 'blue';
    case 'Cliente':
      return 'red';
    default:
      return 'grey';
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
        display: 'flex',
        justifyContent: 'flex-start', // Centrar los íconos
        alignItems: 'center', // Alinear los íconos verticalmente en el centro
        color: getColorForState(state),  // Aplicar color basado en el estado seleccionado
        fontWeight: 'bold',
        '& .MuiSelect-icon': {
          color: getColorForState(state),  // Aplicar color al ícono del select
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        width: '80%',
      }}
    >
      {/* Solo los círculos sin texto */}
      <MenuItem value="Cliente" sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left'}}>
        <CircleIcon style={{ color: 'red', marginRight: -15, border: '2px solid grey', borderRadius:"30px"}} />
      </MenuItem>
      <MenuItem value="Respondio" sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left'}}>
        <CircleIcon style={{ color: 'orange', marginRight: -15, border: '2px solid grey',borderRadius:"30px" }} />
      </MenuItem>
      <MenuItem value="Llamado" sx={{ display: 'flex',justifyContent: 'left', alignItems: 'left' }}>
        <CircleIcon style={{ color: 'green', marginRight: -15, border: '2px solid grey',borderRadius:"30px"}} />
      </MenuItem>
      <MenuItem value="Sin Respuesta" sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}>
        <CircleIcon style={{ color: 'grey', marginRight: -15 , border: '2px solid grey', borderRadius:"30px"}} />
      </MenuItem>
      <MenuItem value="Meet" sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left'}}>
        <CircleIcon style={{ color: 'blue', marginRight: -15, border: '2px solid grey', borderRadius:"30px"}} />
      </MenuItem>
    </Select>
  );
};

export default StateSelector;
