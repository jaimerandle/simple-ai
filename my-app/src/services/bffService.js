// // src/services/authService.js
// const BASE_URL = 'https://ehlomr2ww4uo3kqr27ic2l3woq0lxgvs.lambda-url.us-east-1.on.aws';

// export const loginAuth = async (email, password) => {
//     try {
//         const response = await fetch(`${BASE_URL}/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 "Access-Control-Allow-Origin": '*'
//             },
//             body: JSON.stringify({ email, pass: password }),
//         });

//         if (response.ok) {
//             const data = await response.json();
//             return data.token;  // Devuelve el token si la solicitud fue exitosa
//         } else {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Login failed');
//         }
//     } catch (error) {
//         throw new Error(error.message || 'Error during login');
//     }
// };


// export const getUserInfo = async (token) => {
//     try {
//         const response = await fetch(`${BASE_URL}/me`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             return data;  // Devuelve la información del usuario
//         } else {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to fetch user info');
//         }
//     } catch (error) {
//         throw new Error(error.message || 'Error fetching user info');
//     }
// };

// export const getConversations = async (token) => {
//     try {
//         const response = await fetch(`${BASE_URL}/conversations`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             return data;  // Devuelve el array de conversaciones
//         } else {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to fetch conversations');
//         }
//     } catch (error) {
//         throw new Error(error.message || 'Error fetching conversations');
//     }
// };

// export const getConversationDetails = async (id, token) => {
//     try {
//         const response = await fetch(`${BASE_URL}/conversations/${id}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             return data;
//         } else {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to fetch conversation details');
//         }
//     } catch (error) {
//         throw new Error(error.message || 'Error fetching conversation details');
//     }
// };

// src/services/authService.js
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
