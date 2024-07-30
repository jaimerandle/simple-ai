import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import SimpleTable from '../components/multiTable';

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="d-flex" id="wrapper">
                <Sidebar />
                <div id="page-content-wrapper">
                    <div className="container-fluid">
                        <h1 className="mt-4">Bienvenido Jaime</h1>
                        <p>desde aca podras visualizar todas tus conversaciones con los clientes:</p>
                        <div className="row">
                        <SimpleTable/>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
