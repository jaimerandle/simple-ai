import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { getConversations, updateConversationMetadata, deleteConversation } from '../services/bffService';

// Crear el contexto
const ConversationContext = createContext();

// Acción para manejar los diferentes tipos de actualizaciones
const conversationReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      newState = action.payload;
      break;
    case 'UPDATE_STATE':
      newState = state.map(conversation =>
        conversation.id === action.payload.id
          ? { ...conversation, state: action.payload.newState }
          : conversation
      );
      break;
    case 'DELETE_CONVERSATION':
      console.log('entrre a delete')
      newState = state.filter(conversation => conversation.id !== action.payload.id);
      console.log('State after DELETE_CONVERSATION:', newState);
      break;
    default:
      newState = state;
  }

  // Guardar el nuevo estado en sessionStorage
  sessionStorage.setItem('conversations', JSON.stringify(newState));
  console.log('sessionStorage after update:', sessionStorage.getItem('conversations'));
  
  return newState;
};

// Proveedor de contexto
export const ConversationProvider = ({ children }) => {
  const [conversations, dispatch] = useReducer(conversationReducer, [], () => {
    // Inicializar estado desde sessionStorage si existe
    const savedConversations = sessionStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });

  const fetchConversations = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const conversations = await getConversations(token);
        const formattedConversations = conversations.map(conversation => {
          const date = new Date(conversation.last_updated);
          const formattedDateTime = date.toLocaleString('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).replace(", ", " ");
          return {
            ...conversation,
            formattedFechaHora: formattedDateTime,
            state: conversation.metadata?.state || 'baja',
          };
        });

        dispatch({ type: 'SET_CONVERSATIONS', payload: formattedConversations });
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    }
  };

  useEffect(() => {
    // Fetch initial conversations if not already in sessionStorage
    if (conversations.length === 0) {
      fetchConversations();
    }

    // Listener para actualizaciones en sessionStorage
    const handleStorageChange = (event) => {
      if (event.key === 'conversations') {
        const updatedConversations = JSON.parse(event.newValue);
        console.log('Storage change detected, updating conversations:', updatedConversations);
        dispatch({ type: 'SET_CONVERSATIONS', payload: updatedConversations });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [conversations]);

  const updateState = async (id, newState) => {
    const token = localStorage.getItem('authToken');
    try {
      await updateConversationMetadata(id, { state: newState }, token);
      dispatch({ type: 'UPDATE_STATE', payload: { id, newState } });
    } catch (error) {
      console.error('Error updating conversation state:', error);
    }
  };

  const deleteConversationById = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      await deleteConversation(id, token);
      dispatch({ type: 'DELETE_CONVERSATION', payload: { id } });
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <ConversationContext.Provider value={{ conversations, updateState, deleteConversationById }}>
      {children}
    </ConversationContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useConversations = () => useContext(ConversationContext);
