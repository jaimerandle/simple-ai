import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material';

const NoteDialog = ({ open, handleClose, handleSave, initialNote, initialResponsible, id }) => {
  const [note, setNote] = useState(initialNote || '');
  const [responsible, setResponsible] = useState(initialResponsible || ''); // Estado para el nombre del responsable

  useEffect(() => {
    setNote(initialNote || '');
  }, [initialNote]);

  const handleChangeNote = (event) => {
    setNote(event.target.value);
  };

  const handleChangeResponsible = (event) => {
    setResponsible(event.target.value);
  };

  const handleSaveClick = () => {
    handleSave(note, responsible);
    handleClose();
  };

  useEffect(() => {
    const storedConversations = JSON.parse(sessionStorage.getItem('conversations')) || [];
    const currentConversation = storedConversations.find(conversation => conversation.id.toString() === id);

    if (currentConversation && currentConversation.note) {
      setNote(currentConversation.note); // Cargar la nota si existe
    } else {
      setNote(''); // Si no hay nota, dejar el campo vacío
    }
    if (currentConversation && currentConversation.responsible) {
        setResponsible(currentConversation.responsible); // Cargar la nota si existe
      } else {
        setResponsible(''); // Si no hay nota, dejar el campo vacío
      }
  }, [id]);

  return (
    <>    
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md" // Establece el tamaño del modal
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'black',
          color: 'white',
          boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', // Sombra violeta
          borderRadius: '10px',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>Tus Notas</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            
            margin="dense"
            label="Responsable"
            type="text"
            fullWidth
            variant="outlined"
            value={responsible}
            onChange={handleChangeResponsible}
            sx={{
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
            }}
          />
          <TextField
            margin="dense"
            label="Escribe tus anotaciones aquí"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={note}
            onChange={handleChangeNote}
            sx={{
                input: { color: 'white' },
                label: { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '&.css-mwgald-MuiInputBase-root-MuiOutlinedInput-root':{
                    color:"white"
                  }
                },
              }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{
          color:'red',
          '&:hover': {
            boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', 
          }
        }}>
          Cancelar
        </Button>
        <Button onClick={handleSaveClick} sx={{
          color:'purple',
          '&:hover': {
            boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', 
          }
        }}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default NoteDialog;
