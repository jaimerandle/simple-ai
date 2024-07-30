import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import simpleAi from "../assets/simple-ai.webp"
import SimpleLogo from "../assets/simpleLogo.webp"
import './login.css';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setEmailError('');
        setPasswordError('');

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
            navigate('/home');
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center vh-100 bg-light" >
            <div className="card p-5 login-card">
                <div style={{display:"flex"}}>
                <img style={{width:"200px"}} src={simpleAi} /> <img style={{ height:"50px",width:"50px"}} src={SimpleLogo}/>
                </div>
                <br/>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                        />
                        {emailError && <small className="form-text text-danger">{emailError}</small>}
                    </div>
                    <br></br>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        {passwordError && <small className="form-text text-danger">{passwordError}</small>}
                    </div>
                    <br></br>
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
