import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

function ConfirmationDialog({ open, onConfirm, onCancel, assistantName }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>¿Estás seguro?</DialogTitle>
      <p style={{ margin: '15px' }}>¿Estás seguro de que quieres cambiar de asistente a {assistantName}?</p>
      <DialogActions>
        <Button onClick={onCancel} color="primary">Cancelar</Button>
        <Button onClick={onConfirm} color="primary">Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
