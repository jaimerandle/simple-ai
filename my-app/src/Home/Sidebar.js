import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css'; // Importa el archivo CSS

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);



    return (
        
        <div className={`bg-light border-right ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`} id="sidebar-wrapper" style={{ marginRight:"-70px"}}>
            <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action bg-light">Overview</a>
                <a href="#" className="list-group-item list-group-item-action bg-light">Reports</a>
                <a href="#" className="list-group-item list-group-item-action bg-light">Charts</a>
                <a href="#" className="list-group-item list-group-item-action bg-light">Settings</a>
            </div>
        </div>
    );
};

export default Sidebar;
