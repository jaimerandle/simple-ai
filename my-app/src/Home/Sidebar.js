import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css'; // Importa el archivo CSS

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);



    return (
        
        <div className={`bg-light border-right ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`} id="sidebar-wrapper" style={{ marginRight:"-130px"}}>
            <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action bg-light">Perfil</a>
                <a href="#" className="list-group-item list-group-item-action bg-light">Dashboard</a>
            </div>
        </div>
    );
};

export default Sidebar;
