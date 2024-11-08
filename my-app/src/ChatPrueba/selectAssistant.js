import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function SelectAssistant({ assistants, selectedAssistant, onChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel>Selecciona un asistente</InputLabel>
      <Select
        value={selectedAssistant ? selectedAssistant.id : ''}
        onChange={(e) => onChange(assistants.find(assistant => assistant.id === e.target.value))}
      >
        {assistants.map((assistant) => (
          <MenuItem key={assistant.id} value={assistant.id}>
            {assistant.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectAssistant;
