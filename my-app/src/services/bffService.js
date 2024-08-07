// src/services/authService.js
const BASE_URL = 'https://ehlomr2ww4uo3kqr27ic2l3woq0lxgvs.lambda-url.us-east-1.on.aws';

export const loginAuth = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": '*'
            },
            body: JSON.stringify({ email, pass: password }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.token;  // Devuelve el token si la solicitud fue exitosa
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
    } catch (error) {
        throw new Error(error.message || 'Error during login');
    }
};


export const getUserInfo = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;  // Devuelve la información del usuario
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user info');
        }
    } catch (error) {
        throw new Error(error.message || 'Error fetching user info');
    }
};

export const getConversations = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/conversations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;  // Devuelve el array de conversaciones
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch conversations');
        }
    } catch (error) {
        throw new Error(error.message || 'Error fetching conversations');
    }
};

export const getConversationDetails = async (id, token) => {
    try {
        const response = await fetch(`${BASE_URL}/conversations/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch conversation details');
        }
    } catch (error) {
        throw new Error(error.message || 'Error fetching conversation details');
    }
};
