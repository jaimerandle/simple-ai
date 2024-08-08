import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import SimpleTable from '../components/multiTable';
import { getUserInfo } from '../services/bffService';
import { CircularProgress, Box, useMediaQuery } from '@mui/material';

const Home = () => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                localStorage.clear(); // Limpia todo el localStorage
                sessionStorage.clear(); // Limpia todo el sessionStorage
                navigate('/');
            } else {
                try {
                    const userDetails = await getUserInfo(token);
                    setUserName(userDetails.name); // Assuming the user details have a 'name' field
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    navigate('/');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, [navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{  height: '100vh' }}>
                <div className="d-flex" id="wrapper" style={{ paddingBottom: '100px' }}>
                    <div id="page-content-wrapper" className="w-100">
                        <div classname="roboto-medium"> 
                        <div className="container-fluid px-4">
                            <h1 className="mt-2 pt-4 text-center">Bienvenido {userName}</h1>
                            <p className="text-center">Desde acá podrás visualizar todas tus conversaciones con los clientes:</p>
                            <div className="row justify-content-center">
                                <SimpleTable />
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
