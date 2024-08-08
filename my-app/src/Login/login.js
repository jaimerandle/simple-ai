import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import simpleAi from "../assets/simple-ai.webp";
import SimpleLogo from "../assets/simpleLogo.webp";
import './login.css';
import { loginAuth } from '../services/bffService';
import Spinner from 'react-bootstrap/Spinner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
        sessionStorage.clear();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setEmailError('');
        setPasswordError('');
        setLoginError('');
        setLoading(true);

        let valid = true;

        if (!email) {
            setEmailError('Email is required');
            valid = false;
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        }

        if (valid) {
            try {
                const token = await loginAuth(email, password);

                // Guarda el token en el almacenamiento local
                localStorage.setItem('authToken', token);

                // Navega a la página principal
                navigate('/home');
            } catch (error) {
                console.error('Login error', error.message);
                setLoginError('Invalid email or password');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-5 login-card">
                <div style={{ display: "flex" }}>
                    <img style={{ width: "200px" }} src={simpleAi} alt="Simple AI" />
                    <img style={{ height: "50px", width: "50px" }} src={SimpleLogo} alt="Simple Logo" />
                </div>
                <br />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            className={`form-control ${emailError ? 'is-invalid' : ''}`}
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                        />
                        {emailError && <small className="form-text text-danger">{emailError}</small>}
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        {passwordError && <small className="form-text text-danger">{passwordError}</small>}
                    </div>
                    <br />
                    {loginError && <div className="alert alert-danger">{loginError}</div>}
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm"/> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
