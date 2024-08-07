// src/Home.js

import React from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import SimpleTable from '../components/multiTable';

const Home = () => {
    return (
        <>
            <Navbar />
        <div>
            <div className="d-flex" id="wrapper" style={{paddingBottom: '150px'}}>
                {/* <Sidebar /> */}
                <div id="page-content-wrapper" className="w-100">
                    <div className="container-fluid px-4">
                        <h1 className="mt-2 pt-4 text-center">Bienvenido Jaime</h1>
                        <p className="text-center">Desde acá podrás visualizar todas tus conversaciones con los clientes:</p>
                        <div className="row justify-content-center">
                            <SimpleTable />
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;
