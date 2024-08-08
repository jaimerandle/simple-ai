import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import simpleAi from '../assets/simple-ai.webp';
import SimpleLogo from '../assets/simpleLogo.webp';
import PersonIcon from '@mui/icons-material/Person';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LogoutIcon from '@mui/icons-material/Logout';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Asegúrate de crear y usar este archivo CSS

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        navigate('/'); // Redirige a la página de inicio de sesión
    };

    return (
        <div style={{ backgroundColor: 'white', marginBottom: '20px' }}>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ backgroundColor: 'white' }}>
                <div className="container-fluid">
                    <div className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
                        <img style={{ width: '130px', marginTop: '5px' }} src={simpleAi} alt="Simple AI" onClick={() => navigate("/home")} />
                        <img style={{ height: '30px', width: '30px', marginLeft: '10px' }} src={SimpleLogo} alt="Simple Logo" />
                    </div>
                    <div className="ml-auto" style={{ display: 'flex', alignItems: 'center' }}>
                        <a className="nav-link user-icon-wrapper">
                            <Tooltip title="Perfil">
                                <PersonIcon style={{ height: '30px', width: '30px', cursor: "pointer" }} onClick={() => navigate("/Perfil")} />
                            </Tooltip>
                        </a>
                        <a className="nav-link user-icon-wrapper">
                            <Tooltip title="Dashboard">
                                <EqualizerIcon style={{ height: '30px', width: '30px', cursor: "pointer" }} onClick={() => navigate("/dashboard")} />
                            </Tooltip>
                        </a>
                        <a className="nav-link user-icon-wrapper">
                            <Tooltip title="Cerrar sesión">
                                <LogoutIcon style={{ height: '30px', width: '30px', cursor: "pointer" }} onClick={handleLogout} />
                            </Tooltip>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
