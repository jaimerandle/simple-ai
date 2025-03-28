import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleLogo from "../assets/simpleLogo.webp";
import simpleAiBlack from "../assets/simple-ai.webp";
import './login.css';
import { loginAuth, getUserInfo } from '../services/bffService';
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

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

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
        } else if (!validateEmail(email)) {
            setEmailError('Invalid email format');
            valid = false;
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        }

        if (valid) {
            try {
                const token = await loginAuth(email, password);
                localStorage.setItem('authToken', token);

                const userInfo = await getUserInfo(token);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));

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
        <div className="ALL">
            <div className="login-container d-flex align-items-center justify-content-center vh-100">
                <div className="card p-5 login-card">
                    <div className="logo-container">
                        <img src={SimpleLogo} alt="Simple Logo" className="logo" />
                        <img src={simpleAiBlack} alt="Simple AI" className="logo-text" style={{marginTop:"15px"}} />
                    </div>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email"
                            />
                            {emailError && <small className="form-text text-danger">{emailError}</small>}
                        </div>
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
                        {loginError && <div className="alert alert-danger">{loginError}</div>}
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;