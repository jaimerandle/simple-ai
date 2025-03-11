import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import simpleAi from '../assets/SimpleWhiteAI.png';
import SimpleLogo from '../assets/simpleLogo.webp';
import PersonIcon from '@mui/icons-material/Person';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LogoutIcon from '@mui/icons-material/Logout';
import { Tooltip, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import HomeIcon from '@mui/icons-material/Home';
import './Navbar.css'; // Asegúrate de crear y usar este archivo CSS


const Navbar = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const isMobile = useMediaQuery('(max-width:600px)')

    const handleLogout = () => {
        localStorage.clear(); // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        navigate('/'); // Redirige a la página de inicio de sesión
    };
   useEffect(()=>{
    const info = JSON.parse(localStorage.getItem('userInfo'))
    console.log(info, "INFOOO")
    setName(info.name) 
   },[])

    return (
        <div className={isMobile?"":"NAVBAR"}   style={{ backgroundColor: isMobile? "white" :"white", position:isMobile?"fixed":"" , "z-index": "9999" ,width:isMobile?"100%":"", bottom:isMobile?0:"", height: isMobile?"45px":"", marginTop:!isMobile?? "10px"}}>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ backgroundColor: 'white' }}>
                <div className="container-fluid">
                    <div className="navbar-brand" style={{ display:isMobile?'none':'flex', alignItems: 'center' ,}}>
                        <img style={{ height: '30px', width: '30px', marginLeft: '10px', marginTop: '5px' }} src={SimpleLogo} alt="Simple Logo" />
                        <img style={{ width: isMobile? "70px":'130px', marginTop: '10px', marginLeft: '10px' }} src={simpleAi} alt="Simple AI" onClick={() => navigate("/home")} />
                    </div>
                    {!isMobile? 
                    <div style={{display:'flex',marginTop:"20px"}}>
                        <PersonIcon style={{color:"white"}}/>
                        <p style={{color:"white", marginLeft:"5px"}}>Bienvenido,{" "}<strong>{name}</strong>!</p>
                    </div>
                    : <></>}
                    {!isMobile?
                        <div className="ml-auto" style={{ display: 'flex', alignItems: 'center', width: isMobile?"60%": "" }}>
                             <a className="nav-link user-icon-wrapper" >
                                <Tooltip title="Home" >
                                    <HomeIcon style={{ height:'30px', width: '30px', cursor: "pointer", color:"white" }} onClick={() => navigate("/Home")} />
                                </Tooltip>
                            </a>
                            <a className="nav-link user-icon-wrapper" >
                                <Tooltip title="Test" >
                                    <WhatshotIcon style={{ height:'30px', width: '30px', cursor: "pointer", color:"white" }} onClick={() => navigate("/ChatTest")} />
                                </Tooltip>
                            </a>
                            <a className="nav-link user-icon-wrapper">
                                <Tooltip title="Perfil">
                                    <PersonIcon style={{ height:'30px', width: '30px', cursor: "pointer", color:"white" }} onClick={() => navigate("/Perfil")} />
                                </Tooltip>
                            </a>
                            {/* <a className="nav-link user-icon-wrapper">
                                <Tooltip title="Remarketing">
                                    <ReplyAllIcon style={{ height:'30px', width: '30px', cursor: "pointer", color:"white" }} onClick={() => navigate("/remarketing")} />
                                </Tooltip>
                            </a> */}
                            <a className="nav-link user-icon-wrapper">
                                <Tooltip title="Dashboard">
                                    <EqualizerIcon style={{  height: '30px', width: '30px', cursor: "pointer", color:"white" }} onClick={() => navigate("/dashboard")} />
                                </Tooltip>
                            </a>
                            <a className="nav-link user-icon-wrapper">
                                <Tooltip title="Cerrar sesión">
                                    <LogoutIcon style={{ height: '30px', width: '30px', cursor: "pointer", color:"white"}} onClick={handleLogout} />
                                </Tooltip>
                            </a>
                        </div>
                    :
                       <div style={{display:'flex',justifyContent:'space-between',width:'100%', position:"fixed" ,bottom:"0" }}>
                            <div style={{flex:'4',display:'flex',gap:'25px'}}>
                            <a className="nav-link user-icon-wrapper" >
                                <Tooltip title="Home" >
                                    <HomeIcon style={{ height:'30px', width: '30px', cursor: "pointer", color:"grey" }} onClick={() => navigate("/Home")} />
                                </Tooltip>
                            </a>
                                <a className="nav-link user-icon-wrapper">
                                    <Tooltip title="Test" >
                                        <WhatshotIcon style={{ height:'30px', width: '30px', cursor: "pointer", color:"grey" }} onClick={() => navigate("/ChatTest")} />
                                    </Tooltip>
                                </a>
                                <a className="nav-link user-icon-wrapper">
                                    <Tooltip title="Perfil">
                                        <PersonIcon style={{ height:'30px', width: '30px', cursor: "pointer", color:"grey" }} onClick={() => navigate("/Perfil")} />
                                    </Tooltip>
                                </a>
                                <a className="nav-link user-icon-wrapper">
                                    <Tooltip title="Dashboard">
                                        <EqualizerIcon style={{  height: '30px', width: '30px', cursor: "pointer", color:"grey" }} onClick={() => navigate("/dashboard")} />
                                    </Tooltip>
                                </a>
                            </div>
                            <div style={{flex:'1',display:'flex',alignItems:"center" ,justifyContent:'center'}}>
                                <a className="nav-link user-icon-wrapper">
                                    <Tooltip title="Cerrar sesión">
                                        <LogoutIcon style={{ height: '30px', width: '30px', cursor: "pointer", color:"grey"}} onClick={handleLogout} />
                                    </Tooltip>
                                </a>
                            </div>
                       </div> 
                    }
                    
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
