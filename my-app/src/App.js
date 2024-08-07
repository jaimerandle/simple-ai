import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login/login';
import Home from './Home/Home';
import SimpleTable from './components/multiTable';
import ConversationDetails from './components/ConversationDetails';
import UserInfo from './userInfo/userInfo';
import UserStats from './dashboard/userStadistics';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/conversation/:id" element={<ConversationDetails />} />
                <Route path="/conversations" element={<SimpleTable />} />
                <Route path="/Perfil" element={<UserInfo />}/>
                <Route path="/dashboard" element={ <UserStats />}/>
            </Routes>
        </Router>
    );
}

export default App;
