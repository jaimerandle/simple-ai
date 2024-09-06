import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CanalLogo from '../components/CanalLogo';
import StateSelector from '../components/StateSelector';
import { deleteConversation, updateConversationMetadata } from '../services/bffService';
import DeleteDialog from './DeleteDialog';
import NoteDialog from './NoteDialog'; // Importa el nuevo modal de anotaciones
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Delete from "../assets/Delete.png"
import Notes from "../assets/description.png"

const ConversationHeader = ({ conversation, id, isMobile, onStateChange, canal , logoSrc }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false); // Estado para el modal de anotaciones
  const [initialNote, setInitialNote] = useState('');
  const [initialResponsible, setInitialResponsible] = useState(''); // Estado para cargar la nota inicial
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar la nota inicial desde sessionStorage si existe
    const storedConversations = JSON.parse(sessionStorage.getItem('conversations')) || [];
    const currentConversation = storedConversations.find(convo => convo.id.toString() === id);
    if (currentConversation && currentConversation.note) {
      setInitialNote(currentConversation.note);
    }
    if (currentConversation && currentConversation.responsible) {
        console.log(currentConversation.initialResponsible,"JAIME RES")
        setInitialResponsible(currentConversation.responsible);
      }
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await deleteConversation(id, token);

      const storedConversations = JSON.parse(sessionStorage.getItem('conversations'));
      if (storedConversations) {
        const updatedConversations = storedConversations.filter(conversation => conversation.id !== parseInt(id));
        sessionStorage.setItem('conversations', JSON.stringify(updatedConversations));
      }

      setOpenDeleteDialog(false);
      navigate('/home');
    } catch (error) {
      console.error('Error al eliminar la conversación:', error.message);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenNoteDialog = () => {
    setOpenNoteDialog(true);
  };

  const handleCloseNoteDialog = () => {
    setOpenNoteDialog(false);
  };

  const handleSaveNote = async (note, responsible) => {
    // Actualiza el sessionStorage
    const storedConversations = JSON.parse(sessionStorage.getItem('conversations')) || [];
    const updatedConversations = storedConversations.map(conversation => {
        if (conversation.id.toString() === id) {
            return {
                ...conversation,
                note: note,
                responsible: responsible,
                state: conversation.state || "baja", // Si el state es null, setear a "baja"
            };
        }
        return conversation;
    });

    sessionStorage.setItem('conversations', JSON.stringify(updatedConversations));
    console.log('Nota guardada en sessionStorage:', note);

    // Actualiza la metadata en el backend
    const token = localStorage.getItem('authToken');
    const currentConversation = updatedConversations.find(conversation => conversation.id.toString() === id);

    if (currentConversation) {
        try {
            const existingMetadata = currentConversation.metadata || {};
            const newMetadata = {
                ...existingMetadata,
                note: note,
                state: currentConversation.state || "baja",
                responsible: responsible // Si el state es null, setear a "baja"
            };

            await updateConversationMetadata(id, newMetadata, token);
            console.log('Nota actualizada en el backend:', newMetadata);
        } catch (error) {
            console.error('Error al actualizar la metadata en el backend:', error.message);
        }
    }
  };

  const numeroCorto = conversation.channel_source?.substr(3, 18);

  return (
    <Box sx={{ padding: 2, marginTop: "20px",width:"30%", textAlign:"left" }}>
         <Typography color="#6728B8"><strong>ID: {conversation.id} </strong></Typography>
      <br></br>
      <Typography style={{marginBottom:"7px"}} color="#867F8A"><strong>Canal:</strong> {canal === "MELI" ? "Mercado Libre" : canal}</Typography>
      <Typography style={{marginBottom:"7px"}} color="#867F8A"><strong>{canal === "MELI" ? "Referencia:" : "Numero:"}</strong> {canal === "MELI" ? conversation.channel_source : numeroCorto}</Typography>
      <Typography  style={{marginBottom:"7px"}}color="#867F8A"><strong>Fecha:</strong> {new Date(conversation.last_updated).toLocaleDateString()}</Typography>
      <Typography style={{marginBottom:"7px"}}color="#867F8A"><strong>Hora:</strong> {new Date(conversation.last_updated).toLocaleTimeString()}</Typography>
      <div style={{ display: "flex", justifyContent: "center", width: isMobile ? "30%" : "50%", marginTop: "10px", marginBottom: "10px" }} >
        <strong style={{ width: "100%"}}>
          <StateSelector id={id} initialState={conversation.metadata ? conversation.metadata.state : "baja"} onStateChange={onStateChange}/>
        </strong>
      </div>
      <div style={{display:"flex"}}> 
      <Button style={{color:"transparent", border:"1px solid #EB4335", color:"#EB4335", width:"40%", fontSize:"10px", height:"90px", display:"inline-grid" }} onClick={handleOpenDeleteDialog} sx={{ mt: 2 }}>
        <img style={{height:"30px", marginLeft:"40%"}} src={Delete} alt=""/>
        Eliminar conversación
      </Button>
      <Button onClick={handleOpenNoteDialog} sx={{ mt: 2, ml: 2 }}  style={{color:"transparent", border:"1px solid grey", color:"grey", width:"40%", fontSize:"10px", height:"90px", display:"inline-grid" }}>
      <img style={{height:"30px", marginLeft:"30%"}} src={Notes} alt=""/>
        Ver Notas
      </Button>
      </div>
      <DeleteDialog open={openDeleteDialog} handleClose={handleCloseDeleteDialog} handleDelete={handleDelete} />
      <NoteDialog 
        open={openNoteDialog} 
        handleClose={handleCloseNoteDialog} 
        handleSave={handleSaveNote} 
        initialNote={initialNote}
        initialResponsible={initialResponsible} 
        id={id}
      />
    </Box>
  );
};

export default ConversationHeader;
