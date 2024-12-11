import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material';

const NoteDialog = ({ open, handleClose, handleSave, initialNote, initialResponsible, id }) => {
  const [note, setNote] = useState(initialNote || '');
  const [responsible, setResponsible] = useState(initialResponsible || '');

  // Este efecto se ejecuta cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      const storedConversations = JSON.parse(sessionStorage.getItem('conversations')) || [];
      const currentConversation = storedConversations.find(conversation => conversation.id.toString() === id);
      
      if (currentConversation) {
        setNote(currentConversation.note || '');
        setResponsible(currentConversation.responsible || '');
      } else {
        setNote(initialNote || '');
        setResponsible(initialResponsible || '');
      }
    }
  }, [open, initialNote, initialResponsible, id]);

  const handleChangeNote = (event) => {
    setNote(event.target.value);
  };

  const handleChangeResponsible = (event) => {
    setResponsible(event.target.value);
  };

  const handleSaveClick = () => {
    // Actualizamos el sessionStorage cuando se guarda
    const storedConversations = JSON.parse(sessionStorage.getItem('conversations')) || [];
    const updatedConversations = storedConversations.map(conversation => {
      if (conversation.id.toString() === id) {
        return {
          ...conversation,
          note: note,
          responsible: responsible,
        };
      }
      return conversation;
    });

    sessionStorage.setItem('conversations', JSON.stringify(updatedConversations));

    handleSave(note, responsible);
    handleClose();
  };

  return (
    <>    
      <style jsx global>
        {`
        .css-qkin6e{
            color: black
        }
        `}
      </style>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', 
            borderRadius: '10px',
          },
        }}
      >
        <DialogTitle sx={{ color: 'black', textAlign: 'center' }}>Tus Notas</DialogTitle>
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
                input: { color: 'grey' },
                label: { color: 'grey' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'grey',
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
                input: { color: 'grey' },
                label: { color: 'grey' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'grey',
                  },
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
