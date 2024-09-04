import React from 'react';
import './Loading.css';
import logo from '../assets/simpleLogo.webp'; // Ajusta la ruta según corresponda
import Simple from "../assets/SimpleAiWhite.png";

function Loading() {
    return (
        <div className="loading-container">
            <img src={logo} alt="Loading" className="loading-logo" />
            <img src={Simple} style={{width:"40%"}}/>
        </div>
    );
}

export default Loading;
