import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login/login';
import Home from './Home/Home';

import SimpleTable from './components/multiTable';
import ConversationDetails from './components/ConversationDetails';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/conversation/:id" element={<ConversationDetails />} />
                <Route path="/conversations" element={<SimpleTable />} />
            </Routes>
        </Router>
    );
}

export default App;
