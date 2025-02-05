import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const ChannelTypeSelect = ({ value, onChange, required = false }) => {
  const channelTypes = [
    { id: 1, name: "WhatsApp" },
    { id: 2, name: "Instagram" },
    { id: 3, name: "MercadoLibre" },
    { id: 4, name: "Whatsapp (gen)" },
    { id: 5, name: "Instagram (gen)" },
    { id: 6, name: "Demo (gen)" },
    { id: 7, name: "WhatsApp (Baileys)" }
  ];

  return (
    <FormControl fullWidth required={required}>
      <InputLabel>Channel Type</InputLabel>
      <Select
        value={value}
        label="Channel Type"
        onChange={onChange}
      >
        {channelTypes.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(ChannelTypeSelect);