// DeleteDialog.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const DeleteDialog = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          padding: '10px', 
          backgroundColor:"black",
          color:"white",
          boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)',
          borderRadius:"20px"
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">¿Estás seguro de que queres eliminar esta conversación?</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} sx={{
          color:'purple',
          '&:hover': {
            boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', 
          }
        }}>
        Cancelar</Button>
        <Button onClick={handleDelete} sx={{
          color:'red',
          '&:hover': {
            boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', 
          }
        }}>
        Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
