import React from 'react';
import { useParams } from 'react-router-dom';
import Login from '../components/login';
import Register from '../components/register';

function Auth() {
    const { type } = useParams();

    return (
        <div>
            {type === "login" ? <Login/> : type === "register" ? <Register/>: <p>Invalid URL</p>}
        </div> 
    )
}

export default Auth;