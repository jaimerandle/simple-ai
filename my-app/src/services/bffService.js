
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


