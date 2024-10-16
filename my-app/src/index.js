import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { ConversationProvider } from './utils/ConversationContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<ThemeProvider theme={theme}>
    <ConversationProvider>
<App />
</ConversationProvider>
</ThemeProvider>,
document.getElementById('root')
);
