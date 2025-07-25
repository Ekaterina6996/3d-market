import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userName', res.data.userName);
            localStorage.setItem('userRole', res.data.userRole);
            window.location.href = '/dashboard';
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, p: 2 }}>
            <Typography component="h1" variant="h5">Sign In</Typography>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <TextField margin="normal" required fullWidth label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
        </Box>
    );
};

export default Login;