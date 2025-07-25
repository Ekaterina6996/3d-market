import React, { useState } from 'react';
import { Container, Paper, Box, Tabs, Tab } from '@mui/material';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage: React.FC = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ marginTop: 8, padding: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                </Box>
                {value === 0 && <Login />}
                {value === 1 && <Register />}
            </Paper>
        </Container>
    );
};

export default AuthPage;