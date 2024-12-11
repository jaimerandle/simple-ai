import React from 'react';
import { TextField, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const TableHeader = ({ filter, onFilterChange, onRefresh }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <TextField
        label="Filtrar"
        variant="outlined"
        value={filter}
        onChange={onFilterChange}
        fullWidth
        margin="normal"
        style={{ width: "400px" }}
      />
      <IconButton color="primary" onClick={onRefresh}>
        <RefreshIcon />
      </IconButton>
    </div>
  );
};

export default TableHeader;
