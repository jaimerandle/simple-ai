import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { deleteConversation } from '../services/bffService';

const ActionButton = ({ row, onDelete }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleViewConversation = () => {
    const url = `/conversation/${row.id}`; 
    window.open(url, '_blank');
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await deleteConversation(row.id, token);
      onDelete(row.id);
      setOpen(false);
    } catch (error) {
      console.error('Error al eliminar la conversación:', error.message);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton color="primary" onClick={handleViewConversation}>
        <VisibilityIcon style={{ color: "#b0b0b0"}} />
      </IconButton>
      <IconButton color="secondary" onClick={handleOpen}>
        <DeleteIcon style={{ color: "#b0b0b0" }} />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>¿Estás seguro de que quieres borrar la conversación con la referencia "{row.referencia}" y ID {row.id}?</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancelar</Button>
          <Button onClick={handleDelete} color="secondary">Borrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionButton;
