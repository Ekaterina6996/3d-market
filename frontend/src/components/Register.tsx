import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import axios from 'axios';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:3000/api/users/register', { name, email, password, role });
            setSuccess('Registration successful! Please login.');
        } catch (err) {
            setError("Failed to register. User may already exist.");
        }
    };
    
    const handleRoleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, p: 2 }}>
            <Typography component="h1" variant="h5">Register</Typography>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            <TextField margin="normal" required fullWidth label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">I am a...</InputLabel>
                <Select
                    labelId="role-select-label"
                    value={role}
                    label="I am a..."
                    onChange={handleRoleChange}
                >
                    <MenuItem value={'Customer'}>Customer</MenuItem>
                    <MenuItem value={'Maker'}>Maker</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Register</Button>
        </Box>
    );
};

export default Register;