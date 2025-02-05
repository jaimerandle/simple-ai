import { FormControlLabel, Switch } from '@mui/material';
import React, { useState } from 'react';

const ButtonToggle = ({ label, value = 0, onChange }) => {
  const [numValue, setNumValue] = useState(value);

  const handleChange = (event) => {
    const newValue = event.target.checked ? 1 : 0;
    setNumValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-2">
       <p className="ml-2">{label}</p>
       <FormControlLabel
        control={
          <Switch 
            checked={numValue === 1}
            onChange={handleChange}
          />
        }
       
      />
     
    </div>
  );
};

export default ButtonToggle;