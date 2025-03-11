
import apiClient from './apiClient';

export const loginAuth = async (email, password) => {
    try {
        const response = await apiClient.post('/login', {
            email,
            pass: password,
        });

        return response.data.token;  // Devuelve el token si la solicitud fue exitosa
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error during login');
    }
};

export const getUserInfo = async (token) => {
    try {
        const response = await apiClient.get('/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;  // Devuelve la información del usuario
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching user info');
    }
};

export const getConversations = async (token) => {
    try {
        const response = await apiClient.get('/conversations', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;  // Devuelve el array de conversaciones
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching conversations');
    }
};

export const getConversationDetails = async (id, token) => {
    try {
        const response = await apiClient.get(`/conversations/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;  // Devuelve los detalles de la conversación
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching conversation details');
    }
};

export const updateConversationMetadata = async (id, metadata, token) => {
    try {
        const response = await apiClient.post(`/conversations/${id}/metadata`, metadata, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;  // Devuelve la respuesta de la actualización
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update conversation metadata');
    }
};

export const deleteConversation = async (id, token) => {
    try {
        const response = await apiClient.delete(`/conversations/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;  // Devuelve la respuesta de la eliminación
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete conversation');
    }
};

export const getAssistants = async (token) => {
    try {
        const response = await apiClient.get('/assistants', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;  // Devuelve la lista de asistentes
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching assistants');
    }
};

// Actualizar el asistente
export const updateAssistant = async (id, updatedAssistant, token) => {
    try {
        const response = await apiClient.put(`/assistants/${id}`, updatedAssistant, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;  // Devuelve la respuesta de la actualización
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update assistant');
    }
};

export const pauseConversation = async (id, token) => {
    try {
        const response = await apiClient.post(`/conversations/${id}/pause`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;  // Devuelve la respuesta de la conversación pausada
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error pausing the conversation');
    }
};

export const resumeConversation = async (id, token) => {
    try {
        const response = await apiClient.post(`/conversations/${id}/resume`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;  // Devuelve la respuesta de la conversación reanudada
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error resuming the conversation');
    }
};


export const sendManualMessage = async (conversationId, message) => {
    try {
      await fetch(`/conversations/${conversationId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });
      console.log('Mensaje manual enviado');
    } catch (error) {
      console.error('Error al enviar mensaje manual:', error);
    }
  };

  export const replyToConversation = async (id, message, token) => {
    try {
        const response = await apiClient.post(`/conversations/${id}/reply`, message, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;  // Devuelve la respuesta de enviar el mensaje
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error sending manual message');
    }
};

export const getChannels = async (token) => {
    try {
        const response = await apiClient.get('/channels', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;  // Devuelve la lista de canales
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching channels');
    }
};

// Subir un archivo
export const uploadFile = async (fileData, token) => {
  try {
    const response = await apiClient.post('/files', fileData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;  // Devuelve la respuesta de la carga
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error uploading file');
  }
};

// Obtener los archivos cargados para un usuario específico
export const getUserFiles = async (userId, token) => {
  try {
    const response = await apiClient.get(`/listFilesUser/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }); //client_id
    return response.data;  // Devuelve los archivos del usuario
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching user files');
  }
};

export const deleteFiles = async (userId, token, file) => {
    try {
      const response = await apiClient.delete(`/filesUser/${userId}`, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',  // Especificamos que el cuerpo es JSON
          },
          data: { filename: file },  // Utilizamos `data` en lugar de `body` para algunas bibliotecas HTTP (como Axios)
      });

      return response.data;  // Devuelve los archivos del usuario
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el archivo');
    }
};


  
  

