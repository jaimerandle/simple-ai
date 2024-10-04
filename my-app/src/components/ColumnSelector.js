import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';

const ColumnSelector = ({ availableColumns, selectedColumns, onSave, onClose }) => {
  const [localSelectedColumns, setLocalSelectedColumns] = useState(selectedColumns);

  const handleCheckboxChange = (columnName) => {
    setLocalSelectedColumns((prevSelected) =>
      prevSelected.includes(columnName)
        ? prevSelected.filter((col) => col !== columnName)
        : [...prevSelected, columnName]
    );
  };

  const handleSave = () => {
    onSave(localSelectedColumns);
    onClose();
  };

  return (
    <>
 
    <Dialog open onClose={onClose}>
      <DialogTitle>Seleccionar Columnas</DialogTitle>
      <DialogContent>
        {availableColumns.map((column) => (
          <FormControlLabel
            key={column.field}
            control={
              <Checkbox
                checked={localSelectedColumns.includes(column.field)}
                onChange={() => handleCheckboxChange(column.field)}
              />
            }
            label={column.headerName}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default ColumnSelector;
