import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notificaciones = ({ open, onClose, message }) => {
  return (
    <Snackbar open={open} autoHideDuration={3500} onClose={onClose}>
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notificaciones;
